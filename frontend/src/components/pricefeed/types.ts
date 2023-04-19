import { BigNumber } from "ethers";

export type EthPriceFeedDetails = {
  ethPriceFeedAddress?: string;
  ethUsdPrice?: BigNumber;
  lastUpdatedAt?: BigNumber;
  refetchEthFeed?: () => void;
};
