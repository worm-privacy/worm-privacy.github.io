import { anvil, mainnet, sepolia } from 'viem/chains';
import { useChainId } from 'wagmi';

export function useNetwork(): WormNetwork {
  let chainId = useChainId();
  switch (chainId) {
    case mainnet.id:
      return 'mainnet';
    case sepolia.id:
      return 'sepolia';
    case anvil.id:
      return 'anvil';
    default:
      throw `network not supported, chain_id: ${chainId}`;
  }
}

export type WormNetwork = 'mainnet' | 'sepolia' | 'anvil';
