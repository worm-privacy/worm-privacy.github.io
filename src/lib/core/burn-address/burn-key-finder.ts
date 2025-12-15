import { keccak256 } from 'ethers';
import { concatBytes } from '../utils/combine-bytes';
import { hasMinZeroBytes } from '../utils/has-min-zero-bytes';
import { numberToBytes } from '../utils/number-to-bytes';
import { secureRandomBigIntBits } from '../utils/random-bigint';
import { BurnExtraCommitment } from './extra-commitment';

const FIELD_SIZE = BigInt('21888242871839275222246405745257275088548364400416034343698204186575808495617');
const MIN_ZEROS = 2;
const MAX_ITERATIONS = 100000000;

export async function findBurnKey(burnExtraCommit: BurnExtraCommitment, revealAmount: bigint): Promise<bigint> {
  if (revealAmount > BigInt('10000000000000000000')) {
    throw 'Cannot burn more than 10 ETH!';
  }

  try {
    const revealAmountBytes = numberToBytes(revealAmount, 32);
    const burnExtraCommitBytes = numberToBytes(burnExtraCommit.hash, 32);
    const eipBytes = new TextEncoder().encode('EIP-7503');

    let burnKey = secureRandomBigIntBits(256);

    let iterations = 0;

    while (iterations < MAX_ITERATIONS) {
      if (burnKey >= FIELD_SIZE) {
        burnKey = BigInt(0);
      }

      const burnKeyBytes = numberToBytes(burnKey, 32);
      const combined = concatBytes(burnKeyBytes, revealAmountBytes, burnExtraCommitBytes, eipBytes);
      const hexString =
        '0x' +
        Array.from(combined)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');

      const hash = keccak256(hexString);
      if (hasMinZeroBytes(hash, MIN_ZEROS)) return burnKey;

      burnKey += BigInt(1);
      iterations++;

      // Push task to end of task queue in JS event loop
      if (iterations % 1000 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    throw new Error(`Could not find suitable burn key within ${MAX_ITERATIONS} iterations`);
  } catch (err) {
    throw err;
  }
}
