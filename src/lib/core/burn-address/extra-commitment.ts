import { ethers, keccak256, solidityPacked } from 'ethers';

export type BurnExtraCommitment = {
  receiverAddress: string;
  proverFee: bigint;
  broadcasterFee: bigint;
  receiverHook: Uint8Array;
  hash: bigint;
};

export const newExtraCommitment = (
  receiverAddress: string,
  proverFee: bigint,
  broadcasterFee: bigint,
  receiverHook: Uint8Array
): BurnExtraCommitment => {
  const packed = solidityPacked(
    ['uint256', 'uint256', 'address', 'bytes'],
    [broadcasterFee, proverFee, receiverAddress, receiverHook]
  );
  const hashed = ethers.toBigInt(keccak256(packed)) >> BigInt(8);
  return {
    receiverAddress: receiverAddress,
    proverFee: proverFee,
    broadcasterFee: broadcasterFee,
    receiverHook: receiverHook,
    hash: hashed,
  };
};
