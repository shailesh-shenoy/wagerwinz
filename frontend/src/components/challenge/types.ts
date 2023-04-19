import { BigNumber } from "ethers";

export type ChallengeDetails = {
  challengeAddress?: string;
  owner?: string;
  startBlock?: BigNumber;
  startTime?: BigNumber;
  entryFee?: BigNumber;
  lockTime?: BigNumber;
  settlementStartTime?: BigNumber;
  settlementEndTime?: BigNumber;
  creator?: string;
  creatorPrediction?: BigNumber;
  challenger?: string;
  challengerPrediction?: BigNumber;
  settled?: boolean;
  settledBy?: string;
  active?: boolean;
  winner?: string;
  creatorWithdrawn?: boolean;
  challengerWithdrawn?: boolean;
  settlementFeePercent?: number;
  settlementFeeMax?: BigNumber;
  currentBlockTimestamp?: BigNumber;
  refetchChallengeDetails?: () => void;
};
