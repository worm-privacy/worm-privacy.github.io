import { MutationStatus } from '@tanstack/react-query';
import { useSendTransaction } from 'wagmi';

export const useTransfer = (): {
  transferETH: (params: TransferETHParams) => Promise<TransferETHResult>;
  status: MutationStatus;
  error?: unknown;
} => {
  const { mutateAsync, status, error } = useSendTransaction();

  const transferETH = async ({ to, value }: TransferETHParams): Promise<TransferETHResult> => {
    try {
      const hash = await mutateAsync({
        to,
        value,
      });
      return { status: 'success', hash };
    } catch (err) {
      return { status: 'error', error: err };
    }
  };

  return {
    transferETH,
    status,
    error,
  };
};

type TransferETHParams = {
  to: `0x${string}`;
  value: bigint; // in wei
};

type TransferETHResult = { status: 'success'; hash: `0x${string}` } | { status: 'error'; error: unknown };
