import { hexToBigInt, hexToBytes, toHex } from 'viem';
import { BurnAddressContent } from '../core/burn-address/burn-address-generator';
import { RapidsnarkOutput } from '../core/miner-api/proof-get-by-nullifier';

export type RecoverData =
  | { type: 'burn'; burn: BurnAddressContent }
  | { type: 'proof'; burn: BurnAddressContent; proof: RapidsnarkOutput; proverAddress: `0x${string}` };

export const newSavableRecoverData = (
  burnAddress: BurnAddressContent,
  proof?: RapidsnarkOutput,
  proverAddress?: `0x${string}`
): any => {
  if (proof)
    return {
      recoverType: 'proof',
      burn: fromBurnAddress(burnAddress),
      proof: proof,
      proverAddress: proverAddress,
    };
  else return { recoverType: 'burn', burn: fromBurnAddress(burnAddress) };
};

export const recoverDataFromJson = (json: any): RecoverData => {
  const burnAddress = toBurnAddress(json.burn);

  switch (json.recoverType) {
    case 'burn':
      return { type: 'burn', burn: burnAddress };

    case 'proof':
      return {
        type: 'proof',
        burn: burnAddress,
        proof: json.proof as RapidsnarkOutput,
        proverAddress: json.proverAddress,
      };

    default:
      throw 'invalid recover file';
  }
};

const toBurnAddress = (obj: any): BurnAddressContent => {
  return {
    burnKey: hexToBigInt(obj.burnKey),
    receiverAddr: obj.receiverAddr,
    proverFee: hexToBigInt(obj.proverFee),
    broadcasterFee: hexToBigInt(obj.broadcasterFee),
    revealAmount: hexToBigInt(obj.revealAmount),
    receiverHook: hexToBytes(obj.receiverHook),
    burnAddress: obj.burnAddress,
  };
};

const fromBurnAddress = (burnAddress: BurnAddressContent): any => {
  return {
    burnKey: toHex(burnAddress.burnKey),
    receiverAddr: burnAddress.receiverAddr,
    proverFee: toHex(burnAddress.proverFee),
    broadcasterFee: toHex(burnAddress.broadcasterFee),
    revealAmount: toHex(burnAddress.revealAmount),
    receiverHook: toHex(burnAddress.receiverHook),
    burnAddress: burnAddress.burnAddress,
  };
};
