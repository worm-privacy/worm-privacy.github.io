import { Icons } from '@/components/ui/icons';
import { useTransfer } from '@/hooks/use-transfer';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { formatEther } from 'ethers';
import { useState } from 'react';
import { useBalance, UseBalanceReturnType, useConnection } from 'wagmi';

export const BurnETHLayout = (props: { burnAddress: BurnAddressContent; onBurnComplete: () => void }) => {
  let account = useConnection();
  let balance = useBalance({ address: account.address });

  let [confirmation, setConfirmation] = useState(false);

  let { transferETH, status, error } = useTransfer();

  const onBackupClick = () => {
    // TODO;
    console.error('TODO');
  };

  const onBurnClick = async () => {
    if (!confirmation) return setConfirmation(true);
    let result = await transferETH({
      to: props.burnAddress.burnAddress as `0x${string}`,
      value: props.burnAddress.revealAmount,
    });

    if (result.status == 'success') {
      console.log(`burn transfer hash: ${result.hash}`);
      props.onBurnComplete();
    } else {
      console.error(`error while transferring: ${result.error}`);
    }
  };

  return (
    <div className=" flex h-[480px] w-full flex-col text-white">
      <div className="mb-6 text-[18px]">
        Send <b>{formatEther(props.burnAddress.revealAmount)} ETH</b> to this burn address:
      </div>
      <div className="mb-6 text-[18px] font-bold">{props.burnAddress.burnAddress}</div>
      <div>Balance</div>
      <div className="flex flex-row">
        <div className="font-bold">{balanceToString(balance)}</div>
        <div className="ml-2 text-[#6E7AF0]">ETH</div>
      </div>

      {/* Spacer */}
      <div className="grow" />

      {/* Buttons */}
      {!confirmation && (
        <div className="mb-4 flex h-10 justify-center text-[14px] font-bold text-brand">
          <button onClick={onBackupClick} className="flex items-center ">
            <Icons.backup className="mr-2" />
            Backup minting data
          </button>
        </div>
      )}
      <button onClick={onBurnClick} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black">
        {confirmation ? 'Continue' : 'Burn ETH'}
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
