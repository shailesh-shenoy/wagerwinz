import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  paths: {
    artifacts: "./frontend/artifacts",
  },
  networks: {
    hardhat: {
      chainId: 1337,
      mining: {
        auto: true,
        interval: 10000,
      },
    },
  },
  typechain: {
    outDir: "./frontend/types/typechain",
  },
};

export default config;
