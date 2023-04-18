import { ChakraProvider } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "./_layout";

import "@/styles/globals.css";
import "@fontsource/arvo/400.css";
import "@fontsource/bayon/400.css";

import { customTheme } from "../utilities/theme";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { sepolia, localhost } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import {
  RainbowKitProvider,
  getDefaultWallets,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

//* This is the main App component
export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        appInfo={appInfo}
        theme={darkTheme({
          accentColor: customTheme.colors.green[600],
          accentColorForeground: "white",
          borderRadius: "medium",
          fontStack: "system",
          overlayBlur: "small",
        })}
      >
        <ChakraProvider resetCSS={true} theme={customTheme}>
          <Head>
            <title>WagerWinz - Create Wagers. Challenge. Win.</title>
            <meta
              name="description"
              content="WagerWinz is a decentralized platform for creating, challenging, and winning wagers. Create a wager, challenge a friend, and win a wager."
            />
            <link
              rel="apple-touch-icon"
              sizes="180x180"
              href="/apple-touch-icon.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="32x32"
              href="/favicon-32x32.png"
            />
            <link
              rel="icon"
              type="image/png"
              sizes="16x16"
              href="/favicon-16x16.png"
            />
            <link rel="manifest" href="/site.webmanifest" />
            <link
              rel="mask-icon"
              href="/safari-pinned-tab.svg"
              color="#5bbad5"
            />
            <meta name="msapplication-TileColor" content="#da532c" />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

//! Configure Wagmi and RainbowKit

const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";

const { chains, provider, webSocketProvider } = configureChains(
  [sepolia, localhost],
  [alchemyProvider({ apiKey: ALCHEMY_API_KEY }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "WagerWinz TESTNET",
  chains,
});

const appInfo = {
  appName: "WagerWinz",
};

const wagmiClient = createClient({
  autoConnect: true,
  provider,
  connectors,
  webSocketProvider,
});
