import { encodePacked } from 'viem';
import { WETHContractAddress } from './contracts/weth';

export type ListedToken = {
  name: string;
  symbol: string;
  decimals: number;

  address: `0x${string}`;
  v3ExactOutPathToWETH: `0x${string}`;
};

export const LISTED_TOKENS: ListedToken[] = [
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    address: `0x6B175474E89094C44Da98b954EedeAC495271d0F`,
    v3ExactOutPathToWETH: encodePacked(
      ['address', 'uint24', 'address'],
      [WETHContractAddress, 3000, '0x6B175474E89094C44Da98b954EedeAC495271d0F']
    ),
  },
  {
    name: 'USD Tether',
    symbol: 'USDT',
    decimals: 6,
    address: `0xdac17f958d2ee523a2206206994597c13d831ec7`,
    v3ExactOutPathToWETH: encodePacked(
      ['address', 'uint24', 'address'],
      [WETHContractAddress, 100, '0xdac17f958d2ee523a2206206994597c13d831ec7']
    ),
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
    v3ExactOutPathToWETH: encodePacked(
      ['address', 'uint24', 'address'],
      [WETHContractAddress, 500, '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48']
    ),
  },
  {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    address: `0x2260fac5e5542a773aa44fbcfedf7c193bc2c599`,
    v3ExactOutPathToWETH: encodePacked(
      ['address', 'uint24', 'address'],
      [WETHContractAddress, 500, '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599']
    ),
  },
];
