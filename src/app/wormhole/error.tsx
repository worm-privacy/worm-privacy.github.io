'use client';

import { Icons } from '@/components/ui/icons';

export default function WormholeErrorComponent(props: { onRecoverClick: () => void; error: WormholeError }) {
  return (
    <div className="flex flex-col">
      {props.error.icon === 'brokenLink' && <Icons.linkBreak fill="white" className="mb-4 h-12 w-12" />}
      {props.error.icon === 'exclamationMark' && <Icons.attention fill="white" className="mb-4 h-12 w-12" />}

      <div className="text-[18px] font-bold text-white">{props.error.title}</div>

      <div className="my-6 text-[15px] text-white">{props.error.description}</div>

      {props.error.action === 'recover' && (
        <button
          onClick={props.onRecoverClick}
          className={`mt-3 flex w-full flex-row items-center justify-center rounded-lg bg-brand px-4 py-3 text-black`}
        >
          <Icons.recover className="mr-2" fill="black" />
          Recover
        </button>
      )}
      {props.error.action === 'start-over' && (
        <button
          onClick={() => window.location.reload()}
          className={`mt-3 flex w-full flex-row items-center justify-center rounded-lg bg-brand px-4 py-3 text-black`}
        >
          Start over
        </button>
      )}
    </div>
  );
}

export type WormholeError = {
  title: string;
  description: string;
  icon: 'brokenLink' | 'exclamationMark';
  action: 'start-over' | 'recover';
};

export namespace WormholeErrors {
  export const RECOVER_BURN_ADDRESS_BALANCE: WormholeError = {
    title: 'Recovery File Invalid',
    description: 'This file belongs to a failed transfer, Your funds are safe. Start a new one to try again',
    icon: 'exclamationMark',
    action: 'start-over',
  } as const;

  export const RECOVER_NULLIFIER_EXISTS: WormholeError = {
    title: 'This file has already been used',
    description:
      "This recovery file was used in completed transfer. Start a new transfer if you'd like to wormhole it again.",
    icon: 'exclamationMark',
    action: 'start-over',
  } as const;

  export const PROCESS_TRANSFER_FAILED: WormholeError = {
    title: 'Transfer failed',
    description:
      "Your funds are safe, The transfer did't complete and the recovery file is now invalid. You can delete it and start over again.",
    icon: 'brokenLink',
    action: 'start-over',
  } as const;

  export const PROCESS_PROOF_FAILED: WormholeError = {
    title: 'Transaction Interrupted!',
    description:
      "The transaction could not be finalized. Don't worry; you can safely resume it later using your backup file via the Recover option below.",
    icon: 'brokenLink',
    action: 'recover',
  } as const;
}
