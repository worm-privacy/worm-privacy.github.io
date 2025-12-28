import { poseidon2 } from 'poseidon-lite';
import { toHex } from '../utils/to-hex';

const NULLIFIER_PREFIX = BigInt('0xba44186ee7876b8007d2482cd46cec2d115b780980a6b46f0363f983d892f7f');

export const calculateNullifier = (burnKey: bigint): bigint => {
  try {
    return poseidon2([toHex(NULLIFIER_PREFIX), toHex(burnKey)]);
  } catch (err) {
    console.error('Error deriving burn address:', err);
    throw new Error('Failed to derive burn address');
  }
};
