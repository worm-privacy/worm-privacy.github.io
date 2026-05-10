const BASE_URL = 'https://etherscan.io' as const;

export type EtherscanLink = `https://etherscan.io/${string}`;

export const etherscanLinkFromTX = (txHash: `0x${string}`): EtherscanLink => `${BASE_URL}/tx/${txHash}`;

export const etherscanLinkFromAddress = (address: `0x${string}`): EtherscanLink => `${BASE_URL}/address/${address}`;
