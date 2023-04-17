// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.18;

import {Challenge} from "./Challenge.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import {Clones} from "@openzeppelin/contracts/proxy/Clones.sol";

contract ChallengeFactory is Ownable {
    uint256 public immutable startBlock;
    uint256 public immutable minEntryFee;
    uint256 public immutable minChallengeDuration;
    uint256 public immutable maxChallengeDuration;
    uint256 public immutable minLockDuration;
    uint256 public immutable maxLockDuration;
    uint256 public immutable settlementDuration;
    address public immutable challengeImplementation;

    event ChallengeCreated(
        address indexed creatorAddress,
        address indexed challengeAddress,
        uint256 indexed lockTime,
        uint256 entryFee,
        uint256 settlementStartTime,
        uint256 settlementEndTime,
        uint256 creatorPrediction
    );

    constructor(
        uint256 _minEntryFee,
        uint256 _minChallengeDuration,
        uint256 _maxChallengeDuration,
        uint256 _minLockDuration,
        uint256 _maxLockDuration,
        uint256 _settlementDuration
    ) {
        //* All time values are in seconds
        //* All currency values are in wei
        //* All prediction values are in USD with abstracted 8 decimal places just like chainlink price feed values

        //! Set the immutable variables which can be determined by EVM globals
        startBlock = block.number;

        //! Set the immutable variables which are passed in as arguments

        //* Minimum allowed entry fee for a challenge contract, to ensure gas costs are covered
        minEntryFee = _minEntryFee;

        //* Minimum allowed challenge duration to ensure that the time for challenging is not too short
        minChallengeDuration = _minChallengeDuration;

        //* Maximum allowed challenge duration to ensure that the time for challenging is not too long
        maxChallengeDuration = _maxChallengeDuration;

        //* Minimum allowed lock duration, after which settlement period starts
        minLockDuration = _minLockDuration;

        //* Maximum allowed lock duration, after which settlement period starts
        maxLockDuration = _maxLockDuration;

        //* Duration of the settlement period, to ensure that the time for settlement is not too short
        settlementDuration = _settlementDuration;

        //! Create an implementation address for the challenge contract, to be used for cloning
        challengeImplementation = address(new Challenge());
    }

    //* Function to get all public variables of the factory contract
    function getFactoryDetails()
        external
        view
        returns (
            address _owner,
            uint256 _startBlock,
            uint256 _minEntryFee,
            uint256 _minChallengeDuration,
            uint256 _maxChallengeDuration,
            uint256 _minLockDuration,
            uint256 _maxLockDuration,
            uint256 _settlementDuration,
            address _challengeImplementation
        )
    {
        _owner = owner();
        _startBlock = startBlock;
        _minEntryFee = minEntryFee;
        _minChallengeDuration = minChallengeDuration;
        _maxChallengeDuration = maxChallengeDuration;
        _minLockDuration = minLockDuration;
        _maxLockDuration = maxLockDuration;
        _settlementDuration = settlementDuration;
        _challengeImplementation = challengeImplementation;
    }

    function createChallenge(uint256 _creatorPrediction, uint256 _lockTime, uint256 _settlementStartTime)
        external
        payable
    {
        //* The creator should pay the minimum entry fee
        require(msg.value >= minEntryFee, "ChallengeFactory: The entry fee sent is too low");

        /*
        * The lockTime is the timestamp in seconds at which the contract is locked and challenges/prediction changes are no longer accepted.
        * This lock time should allow challenges to be open for at least the minimum challenge duration and at most the maximum challenge duration.
        */
        require(_lockTime >= block.timestamp + minChallengeDuration, "ChallengeFactory: The lock time is too early");
        require(_lockTime <= block.timestamp + maxChallengeDuration, "ChallengeFactory: The lock time is too late");

        /*
        * The settlementStartTime is the timestamp in seconds at which the settlement period starts and anyone can send a transaction to settle the wager. 
        * The settlement time should allow the wager to be locked for at least the minimum lock duration and at most the maximum lock duration.
        * The settlement end time will always be determined by settlement start time
        * Using settlementStartTime + settlementDuration 
        * This ensures that the time to settle a wager is always constant, as defined in the contract factory
        */
        require(
            _settlementStartTime >= _lockTime + minLockDuration,
            "ChallengeFactory: The settlement start time is too early"
        );
        require(
            _settlementStartTime <= _lockTime + maxLockDuration,
            "ChallengeFactory: The settlement start time is too late"
        );

        uint256 _settlementEndTime = _settlementStartTime + settlementDuration;
        //* All inputs are valid, so create a new challenge contract
        //* Deploy a new challenge contract
        Challenge challenge = Challenge(Clones.clone(challengeImplementation));
        challenge.initialize{value: msg.value}(
            _lockTime, _settlementStartTime, _settlementEndTime, msg.sender, _creatorPrediction
        );

        emit ChallengeCreated(
            msg.sender,
            address(challenge),
            _lockTime,
            msg.value,
            _settlementStartTime,
            _settlementEndTime,
            _creatorPrediction
        );
    }
}
