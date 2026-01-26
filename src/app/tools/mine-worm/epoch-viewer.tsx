import { UseEpochListResult } from '@/hooks/use-epoch-list';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useEffect, useRef, useState } from 'react';

export default function EpochViewer(props: { result: UseEpochListResult; refresh: () => Promise<void> }) {
  let inner: React.ReactNode = undefined;
  const result = props.result;
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
            <EpochItem
              epoch={epoch}
              current={result.currentEpoch}
              progress={epochProgress}
              refresh={props.refresh}
              key={epoch.num}
            />
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

const EPOCH_DURATION = 600; //seconds

const EpochItem = (props: { epoch: Epoch; current: bigint; progress: number; refresh: () => Promise<void> }) => {
  let epoch = props.epoch;

  const [progress, setProgress] = useState(props.progress);
  const intervalRef = useRef<number | null>(null); // holds interval ID

  useEffect(() => {
    if (props.epoch.num !== props.current) return;
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev > 100) props.refresh();
        return prev + 1;
      });
    }, 6000); // Warning: do not change 6000 (every 6 second is 1%)

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div
      key={epoch.num}
      style={
        {
          '--progress': `${Math.max(0, Math.min(100, progress))}%`,
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
