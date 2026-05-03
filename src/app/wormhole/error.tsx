'use client';

import { Icons } from '@/components/ui/icons';

export default function WormholeErrorComponent(props: { onRecoverClick: () => void }) {
  return (
    <div className="flex flex-col">
      <Icons.linkBreak fill="white" className="mb-4" />

      <div className="text-[18px] font-bold text-white">Transaction Interrupted!</div>

      <div className="my-6 text-[15px] text-white">
        The transaction could not be finalized. Don't worry; you can safely resume it later using your backup file via
        the Recover option below.
      </div>

      <button
        onClick={props.onRecoverClick}
        className={`mt-3 flex w-full flex-row items-center justify-center rounded-lg bg-brand px-4 py-3 text-black`}
      >
        <Icons.recover className="mr-2" fill="black" />
        Recover
      </button>
    </div>
  );
}
