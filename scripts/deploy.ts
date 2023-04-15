import { config, ethers } from "hardhat";
import fs from "fs";

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);

  const MIN_ENTRY_FEE = ethers.utils.parseEther("0.01");
  const MIN_CHALLENGE_DURATION = 60;
  const MAX_CHALLENGE_DURATION = 60 * 60 * 24; // 1 day
  const MIN_LOCK_DURATION = 60;
  const MAX_LOCK_DURATION = 60 * 60 * 24 * 7 * 4; // 4 weeks
  const SETTLEMENT_DURATION = 60 * 60; // 1 hour

  const ChallengeFactory = await ethers.getContractFactory("ChallengeFactory");
  const challengeFactory = await ChallengeFactory.deploy(
    MIN_ENTRY_FEE,
    MIN_CHALLENGE_DURATION,
    MAX_CHALLENGE_DURATION,
    MIN_LOCK_DURATION,
    MAX_LOCK_DURATION,
    SETTLEMENT_DURATION
  );

  await challengeFactory.deployed();

  console.log(
    `ChallengeFactory with entry fee ${ethers.utils.formatEther(
      MIN_ENTRY_FEE
    )}ETH deployed to ${challengeFactory.address}`
  );

  saveFrontendFiles(challengeFactory.address, "CHALLENGE_FACTORY_ADDRESS");
}

function saveFrontendFiles(
  challengeFactoryAddress: string,
  challengeFactoryName: string
) {
  fs.writeFileSync(
    `${config.paths.artifacts}/contracts/challengeFactoryAddress.ts`,
    `export const ${challengeFactoryName} = '${challengeFactoryAddress}'`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
