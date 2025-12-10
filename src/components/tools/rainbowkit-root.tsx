'use client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';

const RainbowKitRoot = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default RainbowKitRoot;

const queryClient = new QueryClient();

import { anvil, sepolia } from 'viem/chains';
const config = getDefaultConfig({
  appName: 'Worm',
  projectId: 'ff488caeeb8e5b10e03f4fe7ba2fda00',
  chains: [mainnet, sepolia, anvil],
});
