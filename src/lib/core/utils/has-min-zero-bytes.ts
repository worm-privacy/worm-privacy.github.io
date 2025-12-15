export function hasMinZeroBytes(hash: string, minZeros: number): boolean {
  const hashWithoutPrefix = hash.slice(2);
  return hashWithoutPrefix.slice(0, minZeros * 2) === '0'.repeat(minZeros * 2);
}
