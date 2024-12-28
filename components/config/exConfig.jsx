import { http, createConfig } from "@wagmi/core";
import { mainnet } from "@wagmi/core/chains";

export const exConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(
      "https://eth-mainnet.g.alchemy.com/v2/VVi7nEIfImNF-kQoXz6CbRZCDWjmlakM"
    ),
  },
});
