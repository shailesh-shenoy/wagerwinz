import { BigNumber } from "ethers";
import challengeFactory from "@/artifacts/contracts/ChallengeFactory.sol/ChallengeFactory.json";

export type ChallengeFactoryDetails = {
  challengeFactoryAddress?: string;
  owner?: string;
  startBlock?: BigNumber;
  minEntryFee?: BigNumber;
  minChallengeDuration?: BigNumber;
  maxChallengeDuration?: BigNumber;
  minLockDuration?: BigNumber;
  maxLockDuration?: BigNumber;
  settlementDuration?: BigNumber;
  challengeImplementation?: string;
  refetchChallengeFactory?: () => void;
};

export type EthPriceFeedDetails = {
  ethPriceFeedAddress?: string;
  ethUsdPrice?: BigNumber;
  lastUpdatedAt?: BigNumber;
  refetchEthFeed?: () => void;
};
