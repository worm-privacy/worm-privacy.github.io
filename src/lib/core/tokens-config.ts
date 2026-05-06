import { WETHContractAddress } from './contracts/weth';

export type CommonToken = {
  name: string;
  symbol: string; // this should be unique
  icon: string;
  decimals: number;

  // this is only for dollar estimate and not a real swap
  pathToTether: SwapPathType; // empty array if token is dollar stablecoin
};

export type ERC20 = CommonToken & {
  type: 'erc20';
  address: `0x${string}`;
  pathToWETH: SwapPathType; // address, fee, address, fee, address...
};

export type NativeToken = CommonToken & {
  type: 'native';
};

export type ListedToken = NativeToken | ERC20;

export type SwapPathType = (number | `0x${string}`)[];

export const DAI = '0x6B175474E89094C44Da98b954EedeAC495271d0F' as const;
export const USDT = '0xdac17f958d2ee523a2206206994597c13d831ec7' as const;
export const USDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48' as const;
export const WBTC = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' as const;

export const LISTED_TOKENS: ListedToken[] = [
  {
    type: 'erc20',
    name: 'Dai Stablecoin',
    symbol: 'DAI',
    decimals: 18,
    address: DAI,
    pathToWETH: [DAI, 3000, WETHContractAddress],
    pathToTether: [],
    icon: '/token-logos/dai.svg',
  },
  {
    type: 'erc20',
    name: 'USD Tether',
    symbol: 'USDT',
    decimals: 6,
    address: USDT,
    pathToWETH: [USDT, 100, WETHContractAddress],
    pathToTether: [],
    icon: '/token-logos/usdt.svg',
  },
  {
    type: 'erc20',
    name: 'USD Coin',
    symbol: 'USDC',
    decimals: 6,
    address: USDC,
    pathToWETH: [USDC, 500, WETHContractAddress],
    pathToTether: [],
    icon: '/token-logos/usdc.svg',
  },
  {
    type: 'erc20',
    name: 'Wrapped Bitcoin',
    symbol: 'WBTC',
    decimals: 8,
    address: WBTC,
    pathToWETH: [WBTC, 500, WETHContractAddress],
    pathToTether: [WBTC, 500, USDT],
    icon: '/token-logos/wbtc.svg',
  },
  {
    type: 'native',
    name: 'Ethereum',
    symbol: 'ETH',
    decimals: 18,
    pathToTether: [WETHContractAddress, 100, USDT],
    icon: '/token-logos/eth.svg',
  },
] as const;

export const getListedTokenConfig = (symbol: string) => LISTED_TOKENS.find((e) => e.symbol === symbol);
