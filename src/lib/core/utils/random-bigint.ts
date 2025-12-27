export function secureRandomBigIntBits(bits: number) {
  if (bits <= 0 || bits % 8 !== 0) {
    throw new Error('bits must be a positive multiple of 8');
  }
  const bytes = bits / 8;
  const buffer = new Uint8Array(bytes);
  crypto.getRandomValues(buffer);

  let result = 0n;
  for (let i = 0; i < bytes; i++) {
    result = (result << 8n) | BigInt(buffer[i]);
  }
  return result;
}
