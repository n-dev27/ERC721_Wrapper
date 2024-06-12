import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  mainnet,
} from 'wagmi/chains';
import {
  metaMaskWallet,
  coinbaseWallet
} from "@rainbow-me/rainbowkit/wallets";

export const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: 'YOUR_PROJECT_ID',
  wallets: [
    {
      groupName: 'Other',
      wallets: [metaMaskWallet, coinbaseWallet]
    }
  ],
  chains: [
    mainnet,
  ],
  ssr: true,
});
