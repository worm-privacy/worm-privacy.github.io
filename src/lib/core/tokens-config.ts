import { WETHContractAddress } from './contracts/weth';

export type ListedToken = {
  name: string;
  symbol: string;
  decimals: number;
  address: `0x${string}`;
  // address, fee, address, fee, address...
  pathToWETH: SwapPathType;
  pathToTether: SwapPathType; // empty array if token is dollar stablecoin
};

export type SwapPathType = (number | `0x${string}`)[];

export const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' as const;
export const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7' as const;
export const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const;
export const WBTC = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' as const;

export const LISTED_TOKENS: ListedToken[] = [
  {
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    address: DAI,
    pathToWETH: [DAI, 3000, WETHContractAddress],
    pathToTether: [],
  },
  {
    name: 'USD Tether',
    symbol: 'USDT',
    decimals: 6,
    address: USDT,
    pathToWETH: [USDT, 100, WETHContractAddress],
    pathToTether: [],
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: USDC,
    pathToWETH: [USDC, 500, WETHContractAddress],
    pathToTether: [],
  },
  {
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    address: WBTC,
    pathToWETH: [WBTC, 500, WETHContractAddress],
    pathToTether: [WBTC, 500, USDT],
  },
];

export const getListedTokenConfig = (address: `0x${string}`) => {
  return LISTED_TOKENS.find((e) => e.address === address);
};
