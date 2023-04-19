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
    bool public creatorWithdrawn;
    bool public challengerWithdrawn;

    event ChallengeAccepted(address indexed _challengerAddress, uint256 _challengerPrediction);

    event ChallengeCancelled(address indexed _cancelledBy);

    event ChallengeSettled(
        address indexed _settledBy,
        address indexed _winner,
        uint256 _ethUsdPrice,
        uint256 _settlementFee,
        uint256 _settledAt
    );

    event AmountWithdrawn(address indexed _withdrawnBy, uint256 _amount);

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
            bool _creatorWithdrawn,
            bool _challengerWithdrawn,
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
        _creatorWithdrawn = creatorWithdrawn;
        _challengerWithdrawn = challengerWithdrawn;
        _SETTLEMENT_FEE_PERCENT = SETTLEMENT_FEE_PERCENT;
        _SETTLEMENT_FEE_MAX = SETTLEMENT_FEE_MAX;
    }

    /*
    *This function is called by the challenger to accept the challenge
    *The challenger must pay the entry fee to accept the challenge
    */
    function acceptChallenge(uint256 _challengerPrediction) external payable {
        //* The challenge must be active
        require(active, "Challenge: The challenge must be active");

        //* The challenge must not have been accepted already
        require(challenger == address(0x0), "Challenge: The challenge has already been accepted");

        //* The challenger must accept the challenge before the lock time
        require(block.timestamp <= lockTime, "Challenge: The challenger must accept the challenge before the lock time");

        //! The entry fee must be paid to accept the challenge
        require(msg.value == entryFee, "Challenge: The entry fee must be paid to accept the challenge");

        //* The challenger cannot predict the same value as the creator as this would be a draw
        require(
            _challengerPrediction != creatorPrediction,
            "Challenge: The challenger cannot predict the same value as the creator"
        );

        //* Set the challenger and the challenger's prediction
        challenger = msg.sender;
        challengerPrediction = _challengerPrediction;

        emit ChallengeAccepted(msg.sender, _challengerPrediction);
    }

    /*
    * This function can be called by the creator
    * Only if the challenge has not been accepted
    */
    function cancelChallenge() external {
        //* The creator must be the caller
        require(msg.sender == creator, "Challenge: Only the creator can cancel the challenge");

        //* The challenge must not have been accepted already
        require(challenger == address(0x0), "Challenge: The challenge has already been accepted");

        //* Set the contract as inactive
        active = false;

        //* Transfer the entry fee back to the creator
        payable(msg.sender).transfer(entryFee);

        emit ChallengeCancelled(msg.sender);
    }

    /*
    * This function is called by anyone to settle the challenge and gain a settlement fee
    * The settler must call this function after the settlement start time and before the settlement end time
    */
    function settleChallenge() external {
        //* The challenge must be active
        require(active, "Challenge: The challenge must be active");

        //* The challenge must not have been settled already
        require(!settled, "Challenge: The challenge has already been settled");

        //* The challenge must have been accepted already
        require(challenger != address(0x0), "Challenge: The challenge has not been accepted");

        //* The challenge must be settled between the settlement start and end times
        require(
            block.timestamp >= settlementStartTime && block.timestamp <= settlementEndTime,
            "Challenge: The challenge must be settled between the settlement start and end times"
        );

        //* Settle the challenge
        settled = true;
        settledBy = msg.sender;

        //* Get the latest ETH/USD price from the chainlink price feed
        (, int256 _ethUsdPriceFromFeed,,,) = ethPriceFeed.latestRoundData();

        //* Convert the ETH/USD price to a uint256
        uint256 _ethUsdPrice = uint256(_ethUsdPriceFromFeed);

        /* 
        * Determine the winner by comparing the proximity 
        * of the creator's prediction & challenger's prediction to the actual price
        */
        uint256 creatorProximity =
            (creatorPrediction > _ethUsdPrice) ? creatorPrediction - _ethUsdPrice : _ethUsdPrice - creatorPrediction;
        uint256 challengerProximity = (challengerPrediction > _ethUsdPrice)
            ? challengerPrediction - _ethUsdPrice
            : _ethUsdPrice - challengerPrediction;
        winner = creatorProximity < challengerProximity ? creator : challenger;

        //* Calculate the settlement fee
        uint256 _calcSettlementFee = (address(this).balance * SETTLEMENT_FEE_PERCENT) / 100;
        uint256 _settlementFee = (_calcSettlementFee > SETTLEMENT_FEE_MAX) ? SETTLEMENT_FEE_MAX : _calcSettlementFee;

        //! Transfer the settlement fee to the settler, remaining balance can be withdrawn by the winner
        payable(msg.sender).transfer(_settlementFee);

        emit ChallengeSettled(msg.sender, winner, _ethUsdPrice, _settlementFee, block.timestamp);
    }

    /**
     * This function can be called by the winner to withdraw the remaining balance
     * IF the challenge was never settled, both the winner and challenger can withdraw their entry fee
     */
    function withdraw() external {
        //* If the challenge has been settled, only the winner can withdraw the remaining balance
        if (settled) {
            //* Only the winner can withdraw
            require(
                msg.sender == winner,
                "Challenge: Only the winner can withdraw the remaining balance as the challenge has been settled"
            );
            uint256 _remainingBalance = address(this).balance;
            payable(msg.sender).transfer(_remainingBalance);
            emit AmountWithdrawn(msg.sender, _remainingBalance);
        } else {
            //* As the challenge is not settled, the participants must wait until the settlement end time to withdraw
            require(
                block.timestamp > settlementEndTime,
                "Challenge: The challenge has not been settled yet, please wait until the settlement end time"
            );
            /* 
            * Since the challenge is not settled until the settlement time
            * Both the winner and challenger can withdraw their entry fee only once
            */
            if (msg.sender == creator) {
                //* The creator can only withdraw their entry fee once
                require(!creatorWithdrawn, "Challenge: The creator has already withdrawn their entry fee");
                creatorWithdrawn = true;
                payable(msg.sender).transfer(entryFee);
                emit AmountWithdrawn(msg.sender, entryFee);
            } else if (msg.sender == challenger) {
                //* The challenger can only withdraw their entry fee once
                require(!challengerWithdrawn, "Challenge: The challenger has already withdrawn their entry fee");
                challengerWithdrawn = true;
                payable(msg.sender).transfer(entryFee);
                emit AmountWithdrawn(msg.sender, entryFee);
            } else {
                revert("Challenge: Only the winner or challenger can withdraw their entry fee");
            }
        }
    }
}
