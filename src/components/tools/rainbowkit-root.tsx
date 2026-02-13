'use client';

import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { mainnet } from 'viem/chains';
import { WagmiProvider } from 'wagmi';

const RainbowKitRoot = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitRoot;

const queryClient = new QueryClient();

// import { sepolia } from 'viem/chains';

// export const mySepoliaConfig = /*#__PURE__*/ defineChain({
//   id: 11_155_111,
//   name: 'Sepolia',
//   nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
//   rpcUrls: {
//     default: {
//       http: [
//         'https://ethereum-sepolia.rpc.subquery.network/public',
//         'https://api.zan.top/eth-sepolia',
//         'https://eth-sepolia-testnet.api.pocket.network',
//         'https://0xrpc.io/sep',
//         'https://ethereum-sepolia.gateway.tatum.io',
//         'https://1rpc.io/sepolia',
//       ],
//     },
//   },
//   blockExplorers: {
//     default: {
//       name: 'Etherscan',
//       url: 'https://sepolia.etherscan.io',
//       apiUrl: 'https://api-sepolia.etherscan.io/api',
//     },
//   },
//   contracts: {
//     multicall3: {
//       address: '0xca11bde05977b3631167028862be2a173976ca11',
//       blockCreated: 751532,
//     },
//     ensUniversalResolver: {
//       address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
//       blockCreated: 8_928_790,
//     },
//   },
//   testnet: true,
// });

const config = getDefaultConfig({
  appName: 'Worm',
  projectId: 'ff488caeeb8e5b10e03f4fe7ba2fda00',
  chains: [mainnet],
});
