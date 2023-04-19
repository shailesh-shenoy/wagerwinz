import { BigNumber, utils } from "ethers";
export const formatDate = (date: Date): string => {
  return date.toLocaleString("en-us", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    timeZoneName: "short",
  });
};

export const formatDateFromTimestampInSeconds = (timestamp: number): string => {
  return formatDate(new Date(timestamp * 1000));
};

export const calculateSettlementIncentive = (
  settlementFeePercent: number,
  settlementFeeMax: BigNumber,
  entryFee: BigNumber
): string => {
  const settlementFee = entryFee.mul(settlementFeePercent * 2).div(100);
  return settlementFee.gt(settlementFeeMax)
    ? utils.formatEther(settlementFeeMax)
    : utils.formatEther(settlementFee);
};
