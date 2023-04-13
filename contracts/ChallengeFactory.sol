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

    mapping(address => Challenge) public activeChallenges;

    constructor(
        uint256 _minEntryFee,
        uint256 _minChallengeDuration,
        uint256 _maxChallengeDuration,
        uint256 _minLockDuration,
        uint256 _maxLockDuration,
        uint256 _settlementDuration
    ) payable {
        //* All time values are in seconds
        //* All currency values are in wei

        //* Set the immutable variables which can be determined by EVM globals
        startBlock = block.number;

        //* Set the immutable variables which are passed in as arguments

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

    function createChallenge(uint256 _creatorPrediction) external payable {
        //* The creator should not have an active challenge present
        require(address(activeChallenges[msg.sender]) == address(0x0), "The creator already has an active challenge");

        Challenge challenge = Challenge(Clones.clone(challengeImplementation));
        challenge.initialize{value: msg.value}(
            msg.value,
            block.timestamp + minChallengeDuration,
            block.timestamp + minChallengeDuration + minLockDuration,
            block.timestamp + minChallengeDuration + minLockDuration + settlementDuration,
            msg.sender,
            _creatorPrediction
        );
        activeChallenges[msg.sender] = challenge;
    }
}
