import { roundEther } from '@/lib/core/utils/round-ether';
import { parseEther } from 'ethers';

export default function ClaimList() {
  return (
    <div className="mx-auto w-[580px]">
      <div className="flex flex-col gap-1 rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg">
        <ReadyToClaimItem epochNumber={100n} share={parseEther('1.2')} />
        <ReadyToClaimItem epochNumber={101n} share={parseEther('1.1')} />
        <ReadyToClaimItem epochNumber={102n} share={parseEther('0.9')} />
        <Divider />
        <UpComingEpochItem epochNumber={103n} share={parseEther('0.2')} />
        <UpComingEpochItem epochNumber={104n} share={parseEther('0.0')} />
        <UpComingEpochItem epochNumber={105n} share={parseEther('0.5')} />
      </div>
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
