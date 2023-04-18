// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Challenge is Ownable {
    /*
    * Constants which are encoded in ABI and are same for all challenge contract instances
    
    * The settlement fee is 2% of the TVL in the challenge contract OR 0.2 ETH, whichever is lower
    */
    uint8 public constant SETTLEMENT_FEE_PERCENT = 2;
    uint64 public constant SETTLEMENT_FEE_MAX = 0.2 ether;

    //* The address of the chainlink price feed for ETH/USD
    AggregatorV3Interface public immutable ethPriceFeed;

    /*
    *Immutable(Techincally) variables which are set at the time of deployment
    *These variables govern the rules and state of the challenge
    */
    uint256 public startBlock;
    uint256 public startTime;
    uint256 public entryFee;
    uint256 public lockTime;
    uint256 public settlementStartTime;
    uint256 public settlementEndTime;
    address public creator;

    //* These variables may change over the lifetime of the contract
    uint256 public creatorPrediction;
    address public challenger;
    uint256 public challengerPrediction;
    bool public settled;
    address public settledBy;
    bool public active;
    address public winner;

    event ChallengeAccepted(address indexed challengerAddress, uint256 challengerPrediction);

    constructor(address _ethPriceFeedAddress) {
        ethPriceFeed = AggregatorV3Interface(_ethPriceFeedAddress);
    }

    function initialize(
        uint256 _lockTime,
        uint256 _settlementStartTime,
        uint256 _settlementEndTime,
        address _creator,
        uint256 _creatorPrediction
    ) public payable {
        //! The contract must not have been initialized already
        require(startBlock == 0, "Contract already initialized");

        //! All of the following variables are technically immutable, except for the creatorPrediction
        //* Set the variables which can be determined by EVM globals
        startBlock = block.number;
        startTime = block.timestamp;

        //* Set the variables which are passed in as arguments
        entryFee = msg.value;
        lockTime = _lockTime;
        settlementStartTime = _settlementStartTime;
        settlementEndTime = _settlementEndTime;
        creator = _creator;
        creatorPrediction = _creatorPrediction;

        //* Set the contract as active
        active = true;
    }

    function getChallengeDetails()
        external
        view
        returns (
            address _owner,
            uint256 _startBlock,
            uint256 _startTime,
            uint256 _entryFee,
            uint256 _lockTime,
            uint256 _settlementStartTime,
            uint256 _settlementEndTime,
            address _creator,
            uint256 _creatorPrediction,
            address _challenger,
            uint256 _challengerPrediction,
            bool _settled,
            address _settledBy,
            bool _active,
            address _winner,
            uint8 _SETTLEMENT_FEE_PERCENT,
            uint64 _SETTLEMENT_FEE_MAX
        )
    {
        _owner = owner();
        _startBlock = startBlock;
        _startTime = startTime;
        _entryFee = entryFee;
        _lockTime = lockTime;
        _settlementStartTime = settlementStartTime;
        _settlementEndTime = settlementEndTime;
        _creator = creator;
        _creatorPrediction = creatorPrediction;
        _challenger = challenger;
        _challengerPrediction = challengerPrediction;
        _settled = settled;
        _settledBy = settledBy;
        _active = active;
        _winner = winner;
        _SETTLEMENT_FEE_PERCENT = SETTLEMENT_FEE_PERCENT;
        _SETTLEMENT_FEE_MAX = SETTLEMENT_FEE_MAX;
    }

    /*
    *This function is called by the challenger to accept the challenge
    *The challenger must pay the entry fee to accept the challenge
    */
    function acceptChallenge(uint256 _challengerPrediction) external payable {
        //* The challenge must not have been accepted already
        require(challenger == address(0x0), "The challenge has already been accepted");

        //* The challenger must accept the challenge before the lock time
        require(block.timestamp <= lockTime, "The challenger must accept the challenge before the lock time");

        //! The entry fee must be paid to accept the challenge
        require(msg.value == entryFee, "The entry fee must be paid to accept the challenge");

        //* The challenger cannot predict the same value as the creator as this would be a draw
        require(
            _challengerPrediction != creatorPrediction, "The challenger cannot predict the same value as the creator"
        );

        //* Set the challenger and the challenger's prediction
        challenger = msg.sender;
        challengerPrediction = _challengerPrediction;

        emit ChallengeAccepted(msg.sender, _challengerPrediction);
    }
}
