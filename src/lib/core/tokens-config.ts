import { WETHContractAddress } from './contracts/weth';

export type ListedToken = {
  name: string;
  symbol: string;
  decimals: number;

  address: `0x${string}`;

  // address, fee, address, fee, address...
  pathToWETH: SwapPathType;
};

export type SwapPathType = (number | `0x${string}`)[];

export const LISTED_TOKENS: ListedToken[] = [
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    address: `0x6B175474E89094C44Da98b954EedeAC495271d0F`,
    pathToWETH: ['0x6B175474E89094C44Da98b954EedeAC495271d0F', 3000, WETHContractAddress],
  },
  {
    name: 'USD Tether',
    symbol: 'USDT',
    decimals: 6,
    address: `0xdac17f958d2ee523a2206206994597c13d831ec7`,
    pathToWETH: ['0xdac17f958d2ee523a2206206994597c13d831ec7', 100, WETHContractAddress],
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: `0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48`,
    pathToWETH: ['0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', 500, WETHContractAddress],
  },
  {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    address: `0x2260fac5e5542a773aa44fbcfedf7c193bc2c599`,
    pathToWETH: ['0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', 500, WETHContractAddress],
  },
];
