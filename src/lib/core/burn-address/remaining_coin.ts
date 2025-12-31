import { poseidon3 } from 'poseidon-lite';
import { toHex } from '../utils/to-hex';

const REMAINING_COIN_PREFIX = BigInt('0xba44186ee7876b8007d2482cd46cec2d115b780980a6b46f0363f983d892f80');

export const calculateRemainingCoinHash = (burnKey: bigint, amount: bigint, spend: bigint): bigint => {
  try {
    if (spend > amount) {
      throw 'Spend amount must be <= amount';
    }
    let diff = amount - spend;
    return poseidon3([toHex(REMAINING_COIN_PREFIX), toHex(burnKey), toHex(diff)]);
  } catch (err) {
    console.error('Error deriving remaining coin:', err);
    throw new Error('Failed to derive remaining coin');
  }
};
