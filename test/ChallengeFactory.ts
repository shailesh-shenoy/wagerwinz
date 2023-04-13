import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { Challenge } from "../frontend/types/typechain";

describe("ChallengeFactory", () => {
  const MIN_ENTRY_FEE = ethers.utils.parseEther("0.01");
  const MIN_CHALLENGE_DURATION = 60;
  const MAX_CHALLENGE_DURATION = 60 * 60 * 24; // 1 day
  const MIN_LOCK_DURATION = 60;
  const MAX_LOCK_DURATION = 60 * 60 * 24 * 7 * 4; // 4 weeks
  const SETTLEMENT_DURATION = 60 * 60; // 1 hour

  async function deployChallengeFactoryFixture() {
    const [owner, account1, account2] = await ethers.getSigners();
    const ChallengeFactory = await ethers.getContractFactory(
      "ChallengeFactory"
    );
    const challengeFactory = await ChallengeFactory.deploy(
      MIN_ENTRY_FEE,
      MIN_CHALLENGE_DURATION,
      MAX_CHALLENGE_DURATION,
      MIN_LOCK_DURATION,
      MAX_LOCK_DURATION,
      SETTLEMENT_DURATION
    );

    await challengeFactory.deployed();

    return { challengeFactory, owner, account1, account2 };
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
      const challengeImplementation: Challenge = await ethers.getContractAt(
        "Challenge",
        challengeImplAddress
      );

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
});
