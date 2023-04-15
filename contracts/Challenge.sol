// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract Challenge is Ownable {
    /*
    *Immutable variables which are set at the time of deployment
    *These variables govern the rules and state of the challenge
    */
    uint256 public startBlock;
    uint256 public startTime;
    uint256 public entryFee;
    uint256 public lockTime;
    uint256 public settlementStartTime;
    uint256 public settlementEndTime;
    address public creator;
    uint256 public creatorPrediction;
    address public challenger;
    uint256 public challengerPrediction;
    address public settledBy;

    function initialize(
        uint256 _entryFee,
        uint256 _lockTime,
        uint256 _settlementStartTime,
        uint256 _settlementEndTime,
        address _creator,
        uint256 _creatorPrediction
    ) public payable {
        //! The contract must not have been initialized already
        require(startBlock == 0, "Contract already initialized");

        //! Only the challengecontroller contract can deploy this contract
        //TODO: Update the address to the challenge controller contract address
        // require(msg.sender == address(0x0), "Only the challenge controller can deploy this contract");

        //! Creator's entry fee has to be paid in the constructor
        require(msg.value == _entryFee, "The entry fee must be paid to deploy the contract");

        //! All of the following variables are technically immutable, except for the creatorPrediction
        //* Set the variables which can be determined by EVM globals
        startBlock = block.number;
        startTime = block.timestamp;

        //* Set the variables which are passed in as arguments
        entryFee = _entryFee;
        lockTime = _lockTime;
        settlementStartTime = _settlementStartTime;
        settlementEndTime = _settlementEndTime;
        creator = _creator;

        creatorPrediction = _creatorPrediction;
    }

    /*
    *This function is called by the challenger to accept the challenge
    *The challenger must pay the entry fee to accept the challenge
    */
    function acceptChallenge(uint256 _challengerPrediction) external payable {
        //* The challenge must not have been accepted already
        require(challenger == address(0x0), "The challenge has already been accepted");

        //! The entry fee must be paid to accept the challenge
        require(msg.value == entryFee, "The entry fee must be paid to accept the challenge");

        //* The challenger cannot predict the same value as the creator as this would be a draw
        require(
            _challengerPrediction != creatorPrediction, "The challenger cannot predict the same value as the creator"
        );

        //* Set the challenger and the challenger's prediction
        challenger = msg.sender;
        challengerPrediction = _challengerPrediction;
    }
}
