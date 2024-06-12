"use client";

import * as React from "react";
import {
  RainbowKitProvider,
  // getDefaultWallets,
  // getDefaultConfig,
} from "@rainbow-me/rainbowkit";
// import {
//   metaMaskWallet,
//   coinbaseWallet
// } from "@rainbow-me/rainbowkit/wallets";
// import { mainnet } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { config } from "./newConfig";

// const { wallets } = getDefaultWallets();

// const config1 = getDefaultConfig({
//   appName: "ERC721 Wrapper",
//   projectId: "YOUR_PROJECT_ID",
//   wallets: [
//     // ...wallets,
//     {
//       groupName: "Other",
//       wallets: [metaMaskWallet, coinbaseWallet],
//     },
//   ],
//   chains: [
//     mainnet,
//   ],
//   ssr: true,
// });

const queryClient = new QueryClient();

export function Providers({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
