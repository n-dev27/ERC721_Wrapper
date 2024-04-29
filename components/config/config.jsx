import { http, createConfig } from "@wagmi/core";
import { mainnet, baseSepolia } from "@wagmi/core/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [baseSepolia],
  connectors: [metaMask()],
  ssr: true,
  transports: {
    // [mainnet.id]: http(
    // "https://eth-mainnet.g.alchemy.com/v2/VVi7nEIfImNF-kQoXz6CbRZCDWjmlakM"
    // ),
    [baseSepolia.id]: http(
      "https://base-sepolia.g.alchemy.com/v2/d0i9OPs3Nw9baS-1DcLw7GV-1Bek75l1"
    ),
  },
});
