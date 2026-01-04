export default function EpochViewer() {
  return (
    <div className="mx-auto w-[580px]">
      <div className="rounded-xl border border-[rgba(var(--neutral-low-rgb),0.24)] bg-[#010204] p-4 shadow-lg">
        <div className="space-y-5">
          <EpochItem epoch={{ ...testEpoch, num: 100n }} current={false} />
          <EpochItem epoch={{ ...testEpoch, num: 101n }} current={false} />
          <EpochItem epoch={{ ...testEpoch, num: 102n }} current={true} />
          <EpochItem epoch={{ ...testEpoch, num: 103n }} current={false} />
          <EpochItem epoch={{ ...testEpoch, num: 104n }} current={false} />
        </div>
      </div>
    </div>
  );
}

const EpochItem = (props: { epoch: Epoch; current: boolean }) => {
  let epoch = props.epoch;
  return (
    <div
      key={epoch.num}
      className={`rounded-xl border px-5 py-6 transition-all duration-300 ${
        props.current
          ? 'border-[rgba(var(--brand-rgb),0.24)] shadow-[0px_0px_20px_3px_rgba(34,197,94,0.1)]'
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
            <span className="font-orbitron text-[16px] text-white">{epoch.wormAmount}</span>
            <span className="text-brand">WORM</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="font-orbitron text-[16px] text-white">{epoch.bethAmount}</span>
          <span className="text-pink-400">BETH</span>
        </div>
        <div className="flex items-center">
          <span className="mr-1 text-gray-400">Your share</span>
          <span className="font-orbitron text-[16px] text-white">{epoch.share}</span>
          <span className="mr-1 font-orbitron text-[16px] text-brand">%</span>
          <span className="text-gray-400">({epoch.shareAmount})</span>
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

const testEpoch: Epoch = {
  num: 1024n,
  bethAmount: 12345n,
  wormAmount: 123456n,
  share: 12,
  shareAmount: 654321n,
};
