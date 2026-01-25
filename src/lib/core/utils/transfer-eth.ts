import { Client } from 'viem';
import { waitForTransactionReceipt } from 'viem/actions';
import { Config } from 'wagmi';
import { SendTransactionMutateAsync } from 'wagmi/query';

export const transferETH = async (
  mutateAsync: SendTransactionMutateAsync<Config, unknown>,
  client: Client,
  amount: bigint,
  to: string
) => {
  console.log(`calling transferETH(${amount}, ${to})`);
  const trxHash = await mutateAsync({ to: to as `0x${string}`, value: amount });
  console.log('waiting for receipt');
  const r = await waitForTransactionReceipt(client, { hash: trxHash });
  if (r.status == 'reverted') throw 'transferETH reverted';
  console.log('got approve receipt');
};
