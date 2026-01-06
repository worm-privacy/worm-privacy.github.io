import { useEpochList } from '@/hooks/use-epoch-list';
import { roundEther } from '@/lib/core/utils/round-ether';

export default function EpochViewer() {
  const result = useEpochList();

  let inner: React.ReactNode = undefined;
  switch (result.status) {
    case 'error':
      inner = <div className="text-red-500">{result.error}</div>;
      break;
    case 'loading':
      inner = <div className="text-white">Loading...</div>;
      break;
    case 'loaded':
      let epochProgress = Number(result.epochPassedTime) / (EPOCH_DURATION / 100);
      inner = (
        <>
          {result.epochs.map((epoch) => (
            <EpochItem epoch={epoch} current={result.currentEpoch} progress={epochProgress} key={epoch.num} />
          ))}
        </>
      );
      break;
  }

  return (
    <div className="mx-auto w-[580px]">
      <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg">
        <div className="space-y-5">{inner}</div>
      </div>
    </div>
  );
}

// 10 minutes
const EPOCH_DURATION = 600;

const EpochItem = (props: { epoch: Epoch; current: bigint; progress: number }) => {
  let epoch = props.epoch;

  let progress = Math.max(0, Math.min(100, props.progress));
  return (
    <div
      key={epoch.num}
      style={
        {
          '--progress': `${progress}%`,
        } as React.CSSProperties
      }
      className={`rounded-xl border px-5 py-6 transition-all duration-300 ${
        props.current == epoch.num
          ? 'progress-bg border-[rgba(var(--brand-rgb),0.24)] shadow-[0px_0px_20px_3px_rgba(34,197,94,0.1)]'
          : 'mx-[58px] border-gray-800 opacity-60 hover:border-gray-700'
      }`}
    >
      <div className="flex flex-row justify-between gap-4">
        <div className="flex items-center space-x-1">
          <span className="text-[16px] text-[#94A3B8]">Epoch num</span>
          <span className="font-orbitron text-[12px] text-white ">{epoch.num}</span>
        </div>

        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex items-center space-x-2">
            <span className="font-orbitron text-[16px] text-white">{roundEther(epoch.wormAmount)}</span>
            <span className="text-brand">WORM</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-orbitron text-[16px] text-white">{roundEther(epoch.bethAmount)}</span>
          <span className="text-pink-400">BETH</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1 text-gray-400">Your share</span>
          <span className="font-orbitron text-[16px] text-white">{epoch.share.toFixed(1)}</span>
          <span className="mr-1 font-orbitron text-[16px] text-brand">%</span>
          <span className="text-gray-400">({roundEther(epoch.shareAmount)})</span>
        </div>
      </div>
    </div>
  );
};

export type Epoch = {
  num: bigint;
  bethAmount: bigint;
  wormAmount: bigint;
  share: number;
  shareAmount: bigint;
};
