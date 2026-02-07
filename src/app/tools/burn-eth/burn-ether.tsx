import ErrorComponent from '@/components/tools/error-component';
import LoadingComponent from '@/components/tools/loading';
import { Icons } from '@/components/ui/icons';
import { BurnAddressContent } from '@/lib/core/burn-address/burn-address-generator';
import { transferETH } from '@/lib/core/utils/transfer-eth';
import { newSavableRecoverData } from '@/lib/utils/recover-data';
import { saveJson } from '@/lib/utils/save-json';
import { formatEther } from 'ethers';
import { useState } from 'react';
import { UseBalanceReturnType, useClient, useSendTransaction } from 'wagmi';

export const BurnETHLayout = (props: { burnAddress: BurnAddressContent; onBurnComplete: () => void }) => {
  const { mutateAsync } = useSendTransaction();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const client = useClient();

  const onBackupClick = () =>
    saveJson(newSavableRecoverData(props.burnAddress), `burn_${props.burnAddress.burnAddress}_backup.json`);

  const onBurnClick = async () => {
    try {
      setLoading(true);
      setError(null);
      await transferETH(mutateAsync, client!, props.burnAddress.revealAmount, props.burnAddress.burnAddress);
      props.onBurnComplete();
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError('Error while transferring ETH');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className=" flex h-[480px] w-full flex-col text-white">
        <LoadingComponent />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-min w-full text-white">
        <ErrorComponent title="Transfer error!" details="Error happened while transferring ETH to burn address" />
      </div>
    );
  }

  return (
    <div className=" flex h-[480px] w-full flex-col text-white">
      <div className="mb-6 text-[18px]">
        Sending <b>{formatEther(props.burnAddress.revealAmount)} ETH</b> to this burn address:
      </div>
      <div className="mb-6 text-[18px] font-bold">{props.burnAddress.burnAddress}</div>

      {/* Spacer */}
      <div className="grow" />

      {/* Buttons */}

      <button
        onClick={onBackupClick}
        className="mb-4 flex h-10 items-center justify-center text-[14px] font-bold text-brand"
      >
        <Icons.backup className="mr-2" />
        Backup minting data
      </button>
      <button onClick={onBurnClick} className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black">
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
