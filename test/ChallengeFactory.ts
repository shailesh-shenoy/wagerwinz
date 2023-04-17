import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
import { Challenge, ChallengeFactory } from "../frontend/src/types/typechain";

describe("ChallengeFactory", () => {
  const MIN_ENTRY_FEE = ethers.utils.parseEther("0.01");
  const MIN_CHALLENGE_DURATION = 60 * 2; // 2 minutes
  const MAX_CHALLENGE_DURATION = 60 * 10; // 10 minutes
  const MIN_LOCK_DURATION = 60 * 2; // 2 minutes
  const MAX_LOCK_DURATION = 60 * 10; // 10 minutes
  const SETTLEMENT_DURATION = 60 * 60; // 1 hour
  const MOCK_CREATOR_PREDICTION = 1999.87913381 * 10 ** 8; //Random value for testing
  const MOCK_CHALLENGER_PREDICTION = 2000.87913381 * 10 ** 8; //Random value for testing
  const MOCK_ENTRY_FEE = ethers.utils.parseEther("0.02");

  async function deployChallengeFactoryFixture() {
    const [owner, challengeCreator, challenger1, challenger2] =
      await ethers.getSigners();
    const ChallengeFactory = await ethers.getContractFactory(
      "ChallengeFactory"
    );
    const challengeFactory: ChallengeFactory = (await ChallengeFactory.deploy(
      MIN_ENTRY_FEE,
      MIN_CHALLENGE_DURATION,
      MAX_CHALLENGE_DURATION,
      MIN_LOCK_DURATION,
      MAX_LOCK_DURATION,
      SETTLEMENT_DURATION
    )) as ChallengeFactory;

    await challengeFactory.deployed();

    const BASE_BLOCK_TIMESTAMP = await time.latest();

    const MOCK_LOCK_TIME = BASE_BLOCK_TIMESTAMP + 60 * 3; // current time + 3 minutes
    const MOCK_SETTLEMENT_TIME = BASE_BLOCK_TIMESTAMP + 60 * 6; // current time + 6 minutes
    return {
      challengeFactory,
      owner,
      challengeCreator,
      challenger1,
      challenger2,
      BASE_BLOCK_TIMESTAMP,
      MOCK_LOCK_TIME,
      MOCK_SETTLEMENT_TIME,
    };
  }

  describe("Deployment", function () {
    it("Should set the correct initialization parameters", async function () {
      const { challengeFactory } = await loadFixture(
        deployChallengeFactoryFixture
      );

      expect(await challengeFactory.minEntryFee()).to.equal(MIN_ENTRY_FEE);

      expect(await challengeFactory.minChallengeDuration()).to.equal(
        MIN_CHALLENGE_DURATION
      );

      expect(await challengeFactory.maxChallengeDuration()).to.equal(
        MAX_CHALLENGE_DURATION
      );

      expect(await challengeFactory.minLockDuration()).to.equal(
        MIN_LOCK_DURATION
      );

      expect(await challengeFactory.maxLockDuration()).to.equal(
        MAX_LOCK_DURATION
      );

      expect(await challengeFactory.settlementDuration()).to.equal(
        SETTLEMENT_DURATION
      );

      console.log(
        "Factory Conditions: ",
        await challengeFactory.getFactoryDetails()
      );
    });

    it("Should set the correct owner", async function () {
      const { challengeFactory, owner } = await loadFixture(
        deployChallengeFactoryFixture
      );

      expect(await challengeFactory.owner()).to.equal(owner.address);
    });

    it("Should initialize an empty challengeImplementation contract", async function () {
      const { challengeFactory } = await loadFixture(
        deployChallengeFactoryFixture
      );

      const challengeImplAddress =
        await challengeFactory.challengeImplementation();
      const challengeImplementation: Challenge = (await ethers.getContractAt(
        "Challenge",
        challengeImplAddress
      )) as Challenge;

      expect(await challengeImplementation.owner()).to.equal(
        challengeFactory.address
      );

      expect(await challengeImplementation.startBlock()).to.equal(0);
      expect(await challengeImplementation.startTime()).to.equal(0);
      expect(await challengeImplementation.entryFee()).to.equal(0);
      expect(await challengeImplementation.lockTime()).to.equal(0);
      expect(await challengeImplementation.settlementStartTime()).to.equal(0);
      expect(await challengeImplementation.settlementEndTime()).to.equal(0);
      expect(await challengeImplementation.creator()).to.equal(
        ethers.constants.AddressZero
      );
      expect(await challengeImplementation.creatorPrediction()).to.equal(0);
      expect(await challengeImplementation.challenger()).to.equal(
        ethers.constants.AddressZero
      );
      expect(await challengeImplementation.challengerPrediction()).to.equal(0);
      expect(await challengeImplementation.settledBy()).to.equal(
        ethers.constants.AddressZero
      );
    });
  });

  describe("Challenge Creation", function () {
    it("Should allow challenge creation if all conditions are met", async function () {
      const {
        challengeFactory,
        challengeCreator,
        MOCK_LOCK_TIME,
        MOCK_SETTLEMENT_TIME,
      } = await loadFixture(deployChallengeFactoryFixture);

      await expect(
        challengeFactory
          .connect(challengeCreator)
          .createChallenge(
            MOCK_CREATOR_PREDICTION,
            MOCK_LOCK_TIME,
            MOCK_SETTLEMENT_TIME,
            {
              value: MOCK_ENTRY_FEE,
            }
          )
      ).to.emit(challengeFactory, "ChallengeCreated");
    });

    it("Should not allow challenge creation if entry fee sent in msg.value is too low", async function () {
      const {
        challengeFactory,
        challengeCreator,
        MOCK_LOCK_TIME,
        MOCK_SETTLEMENT_TIME,
      } = await loadFixture(deployChallengeFactoryFixture);

      const entryFee = ethers.utils.parseEther("0.009");

      await expect(
        challengeFactory
          .connect(challengeCreator)
          .createChallenge(
            MOCK_CREATOR_PREDICTION,
            MOCK_LOCK_TIME,
            MOCK_SETTLEMENT_TIME,
            {
              value: entryFee,
            }
          )
      ).to.be.revertedWith("ChallengeFactory: The entry fee sent is too low");
    });

    it("Should not allow challenge creation if lock time is out of range: block.timestamp + <<minChallengeDuration + maxChallengeDuration>>", async function () {
      const {
        challengeFactory,
        challengeCreator,
        BASE_BLOCK_TIMESTAMP,
        MOCK_SETTLEMENT_TIME,
      } = await loadFixture(deployChallengeFactoryFixture);
      const earlyLockTime = BASE_BLOCK_TIMESTAMP + 60 * 1; // current time + 1 minute
      const lateLockTime = BASE_BLOCK_TIMESTAMP + 60 * 11; // current time + 11 minutes

      console.log("Early Lock Time: ", earlyLockTime);
      console.log("Late Lock Time: ", lateLockTime);
      console.log("Current block time: ", await time.latest());
      console.log("Current timestamp: ", BASE_BLOCK_TIMESTAMP);
      await expect(
        challengeFactory
          .connect(challengeCreator)
          .createChallenge(
            MOCK_CREATOR_PREDICTION,
            earlyLockTime,
            MOCK_SETTLEMENT_TIME,
            {
              value: MOCK_ENTRY_FEE,
            }
          )
      ).to.be.revertedWith("ChallengeFactory: The lock time is too early");

      await expect(
        challengeFactory
          .connect(challengeCreator)
          .createChallenge(
            MOCK_CREATOR_PREDICTION,
            lateLockTime,
            MOCK_SETTLEMENT_TIME,
            {
              value: MOCK_ENTRY_FEE,
            }
          )
      ).to.be.revertedWith("ChallengeFactory: The lock time is too late");
    });
  });
});
