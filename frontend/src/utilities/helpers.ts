import { BigNumber } from "ethers";
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
