import { useClaimList } from '@/hooks/use-claim-list';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useEffect } from 'react';

const CARD_STYLE =
  'mx-auto flex w-[580px] min-h-[580px] flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg' as const;

export default function ClaimList() {
  let [result, refresh] = useClaimList();

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (result.status == 'loading')
    return (
      <div className={CARD_STYLE}>
        <div className="text-white">Loading...</div>
      </div>
    );

  if (result.status == 'error') {
    console.error(result.error);
    return (
      <div className={CARD_STYLE}>
        <div className="text-red-500">Error loading data</div>
      </div>
    );
  }

  if (result.readyToClaim.length == 0 && result.upcoming.length == 0) {
    return (
      <div className={CARD_STYLE}>
        <div className="text-white">Nothing to claim</div>
      </div>
    );
  }

  return (
    <div className={CARD_STYLE}>
      {result.readyToClaim.map((c) => {
        return <ReadyToClaimItem key={c.epochNum} epochNumber={c.epochNum} share={c.amount} />;
      })}
      <Divider />
      {result.upcoming.map((c) => {
        return <UpComingEpochItem key={c.epochNum} epochNumber={c.epochNum} share={c.amount} />;
      })}
    </div>
  );
}

const ReadyToClaimItem = (props: { epochNumber: bigint; share: bigint }) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2 rounded-[12px] bg-[#64748B1F] p-3 text-[16px] text-white">
      <div>
        Epoch num <span className="font-orbitron text-[12px]">{props.epochNumber} </span>
      </div>
      <div className="rounded-4xl bg-[rgba(var(--brand-rgb),0.12)] px-3 py-1 text-[12px] text-[#96FAD1] ">
        Ready to claim
      </div>
      <div className="grow" />
      <div className="text-[14px]">Your share:</div>
      <div className="font-orbitron">{roundEther(props.share, 1)}</div>
      <div className="text-[14px] text-brand">WORM</div>
    </div>
  );
};

const UpComingEpochItem = (props: { epochNumber: bigint; share: bigint }) => {
  return (
    <div className="m-1 flex flex-row items-center gap-2  p-3 text-[16px] text-white opacity-50">
      <div>
        Epoch num <span className="font-orbitron text-[12px]">{props.epochNumber} </span>
      </div>
      <div className="grow" />
      {props.share == 0n ? (
        <div className="text-[14px]">You have no reward on this epoch</div>
      ) : (
        <>
          <div className="text-[14px]">Your share: ~</div>
          <div className="font-orbitron">{roundEther(props.share, 1)}</div>
          <div className=" text-[14px] text-brand">WORM</div>
        </>
      )}
    </div>
  );
};

const Divider = () => {
  return (
    <div className="m-1 flex flex-row">
      <div className="text-[#94A3B8]">Up coming epochs</div>
      <div className="mx-2 my-auto  h-px grow bg-[#94A3B830]" />
    </div>
  );
};
