import { Icons } from '@/components/ui/icons';
import { useBalance, UseBalanceReturnType, useConnection } from 'wagmi';

export const BurnETHLayout = (props: { burnAddress: string; burnAmount: string }) => {
  let account = useConnection();
  let balance = useBalance({ address: account.address });

  const onBackupClick = () => {};
  const onBurnClick = () => {};

  return (
    <div className="h-full w-full text-white">
      <div className="mb-6 text-[18px]">
        Send <b>{props.burnAmount} ETH</b> to this burn address:
      </div>
      <div className="mb-6 text-[18px] font-bold">{props.burnAddress}</div>
      <div>Balance</div>
      <div className="flex flex-row">
        <div className="font-bold">{balanceToString(balance)}</div>
        <div className="ml-2 text-[#6E7AF0]">ETH</div>
      </div>

      {/* Buttons */}
      <div className="mt-50 mb-4 flex h-10 justify-center">
        <button onClick={onBurnClick} className="flex items-center text-sm font-medium text-brand">
          <Icons.backup className="mr-2" />
          Backup minting data
        </button>
      </div>
      <button onClick={onBackupClick} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black">
        Burn ETH
      </button>
    </div>
  );
};

const balanceToString = (balance: UseBalanceReturnType): string => {
  switch (balance.status) {
    case 'pending':
      return 'Getting balance...';
    case 'error':
      console.error(balance.error);
      return 'Error getting balance!';
    case 'success':
      return (Number(balance.data.value) / 1e18).toFixed(4);
  }
};
