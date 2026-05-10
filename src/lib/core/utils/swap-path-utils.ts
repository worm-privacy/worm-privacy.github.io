import { encodePacked } from 'viem';
import { SwapPathType } from '../tokens-config';

/// for exact out operation we need to reverse the path
export const encodeV3ExactOutPath = (path: SwapPathType): `0x${string}` => {
  return encodeV3QuoterPath(path.toReversed());
};

export const encodeV3QuoterPath = (path: SwapPathType): `0x${string}` => {
  return encodePacked(pathToPathTypes(path), path);
};

export const pathToPathTypes = (path: any[]) => {
  if (path.length % 2 == 0) throw `invalid path even number of element, path: ${path}`;
  return path.map((e) => {
    switch (typeof e) {
      case 'string':
        return 'address';
      case 'number':
        return 'uint24';
      default:
        throw `invalid path: type not supported, path: ${path}`;
    }
  });
};
