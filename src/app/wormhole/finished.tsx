'use client';

import { Icons } from '@/components/ui/icons';
import Link from 'next/link';

export default function WormholeFinishedComponent(props: {
  senderTx: `0x${string}` | null;
  receiverTx: `0x${string}` | null;
}) {
  return (
    <div className="flex flex-col">
      <Icons.cheers fill="white" className="mb-4" />

      <div className="text-[18px] font-bold text-white">Successfully Wormed!</div>

      <div className="my-6 text-[15px] text-white">Receiver gets asset from wormhole successfully, & anonymously</div>

      <div className="flex flex-row">
        <Link
          href={`https://etherscan.io/tx/${props.senderTx}`}
          className="mt-3 flex w-full flex-row items-center justify-center rounded-lg border border-[rgba(var(--brand-rgb),0.24)] px-4 py-2 font-bold text-brand"
        >
          <Icons.link className="mr-2" fill="var(--brand)" width={16} height={16} />
          Sender tx
        </Link>

        <div className="w-10" />

        <Link
          href={`https://etherscan.io/tx/${props.receiverTx}`}
          target="_blank"
          className="mt-3 flex w-full flex-row items-center justify-center rounded-lg border border-[rgba(var(--brand-rgb),0.24)] px-4 py-2 font-bold text-brand"
        >
          <Icons.link className="mr-2" fill="var(--brand)" width={16} height={16} />
          Receiver tx
        </Link>
      </div>
    </div>
  );
}
