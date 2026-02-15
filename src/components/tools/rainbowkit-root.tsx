'use client';

import { darkTheme, getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { defineChain } from 'viem';
import { WagmiProvider } from 'wagmi';

const queryClient = new QueryClient();

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

export const mainnet = /*#__PURE__*/ defineChain({
  id: 1,
  name: 'Ethereum',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  blockTime: 12_000,
  rpcUrls: {
    default: {
      http: [
        'https://0xrpc.io/eth',
        'https://eth.merkle.io',
        'https://eth.llamarpc.com',
        'https://eth-mainnet.nodereal.io/v1/1659dfb40aa24bbb8153a677b98064d7',
        'https://ethereum-rpc.publicnode.com',
        'https://rpc.mevblocker.io',
        'https://go.getblock.io/aefd01aa907c4805ba3c00a9e5b48c6b',
        'https://rpc.flashbots.net',
        'https://eth.rpc.blxrbdn.com',
        'https://ethereum-mainnet.gateway.tatum.io',
        'https://public-eth.nownodes.io',
      ],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://etherscan.io',
      apiUrl: 'https://api.etherscan.io/api',
    },
  },
  contracts: {
    ensUniversalResolver: {
      address: '0xeeeeeeee14d718c2b47d9923deab1335e144eeee',
      blockCreated: 23_085_558,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14_353_601,
    },
  },
});

const config = getDefaultConfig({
  appName: 'Worm',
  projectId: 'ff488caeeb8e5b10e03f4fe7ba2fda00',
  chains: [mainnet],
});
