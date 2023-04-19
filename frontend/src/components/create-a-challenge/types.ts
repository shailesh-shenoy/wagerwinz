import { BigNumber } from "ethers";

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
