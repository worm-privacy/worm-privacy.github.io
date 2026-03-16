import { formatEther, parseEther } from 'viem';

export const roundEther = (amount: bigint, maxLen: number = 7): string => {
  if (amount === 0n) return '0';
  const sn = maxLen - 4 > 0 ? '0.' + '0'.repeat(maxLen - 4) + '1' : '0';
  if (amount < parseEther(sn)) return '<' + sn;

  let str = formatEther(amount);
  if (str.indexOf('.') !== -1) {
    str = str.substring(0, maxLen);
    while (str.endsWith('0')) str = str.substring(0, str.length - 1);
    if (str.endsWith('.')) str = str.substring(0, str.length - 1);
  }
  return str;
};

export const roundEtherF = (f: number, precision?: number): string => {
  return f < 1 ? f.toPrecision(1) : f.toFixed(precision ?? 4);
};

export const test_roundEther = () => {
  const assert = (a: any, b: any) => (a !== b ? console.log(`assert(${a}, ${b})`) : undefined);
  console.log('----- test_roundEther -----');

  assert(roundEther(0n), '0');
  assert(roundEther(parseEther('1')), '1');
  assert(roundEther(parseEther('1'), 10), '1');

  assert(roundEther(parseEther('1.000100001'), 5), '1');
  assert(roundEther(parseEther('1.000100001'), 6), '1.0001');
  assert(roundEther(parseEther('1.000100001'), 7), '1.0001');
  assert(roundEther(parseEther('1.000100001'), 10), '1.0001');
  assert(roundEther(parseEther('1.000100001'), 11), '1.000100001');
  assert(roundEther(parseEther('1.000100001'), 12), '1.000100001');

  assert(roundEther(parseEther('10')), '10');
  assert(roundEther(parseEther('10'), 1), '10');

  assert(roundEther(parseEther('0.000000000001')), '<0.0001');
  assert(roundEther(parseEther('0.000000000001'), 9), '<0.000001');

  assert(roundEther(parseEther('1.123456789')), '1.12345');

  assert(roundEther(1n), '<0.0001');

  assert(roundEther(parseEther('12345678'), 1), '12345678');
};
