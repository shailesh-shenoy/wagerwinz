import { defineConfig } from "@wagmi/cli";
import { hardhat, react } from "@wagmi/cli/plugins";

export default defineConfig({
  out: "./frontend/src/generated.ts",
  plugins: [
    hardhat({
      artifacts: "./frontend/src/artifacts",
      project: "../wagerwinz",
    }),
    react(),
  ],
});
