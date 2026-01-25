import { poseidon4 } from 'poseidon-lite';
import { numberToBytes } from '../utils/number-to-bytes';
import { toHex } from '../utils/to-hex';
import { findBurnKey } from './burn-key-finder';
import { newExtraCommitment } from './extra-commitment';

const POSEIDON_BURN_ADDRESS_PREFIX = BigInt('0xba44186ee7876b8007d2482cd46cec2d115b780980a6b46f0363f983d892f7e');

export const generateBurnAddress = async (
  receiverAddr: string,
  proverFee: bigint,
  broadcasterFee: bigint,
  revealAmount: bigint,
  receiverHook: Uint8Array
): Promise<BurnAddressContent> => {
  try {
    let burnExtraCommit = newExtraCommitment(receiverAddr, proverFee, broadcasterFee, receiverHook);
    let burnKey = await findBurnKey(burnExtraCommit, revealAmount);

    const poseidonHash = poseidon4([
      toHex(POSEIDON_BURN_ADDRESS_PREFIX),
      toHex(burnKey),
      toHex(revealAmount),
      toHex(burnExtraCommit.hash),
    ]);

    const hashBytes = numberToBytes(BigInt(poseidonHash), 32);
    const addressBytes = hashBytes.slice(0, 20);

    const burnAddress =
      '0x' +
      Array.from(addressBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');

    return {
      burnKey: burnKey,
      receiverAddr: receiverAddr,
      proverFee: proverFee,
      broadcasterFee: broadcasterFee,
      revealAmount: revealAmount,
      receiverHook: receiverHook,
      burnAddress: burnAddress,
    };
  } catch (err) {
    console.error('Error deriving burn address:', err);
    throw new Error('Failed to derive burn address');
  }
};

export type BurnAddressContent = {
  burnKey: bigint;
  receiverAddr: string;
  proverFee: bigint;
  broadcasterFee: bigint;
  revealAmount: bigint;
  receiverHook: Uint8Array;
  burnAddress: string;
};
