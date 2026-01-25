import { Client } from 'viem';

export namespace UniSwapContract {
  /// returns how much ETH user will get after swapping 'bethAmount' of beth
  export const estimateETH = async (client: Client, bethAmount: bigint): Promise<bigint> => {
    throw 'not implemented';
    return bethAmount;
  };
}
