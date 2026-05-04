'use client';

import { POOL_SHARE_INV } from '@/lib/core/utils/beth-amount-calculator';
import { roundUnits } from '@/lib/core/utils/round-ether';
import WormholeCostDetailsComponent from './cost-details';
import { WormholeRestComponentResult } from './rest';

export default function WormholeReadyToSendComponent(props: { restResult: WormholeRestComponentResult }) {
  const burnAmount = roundUnits(props.restResult.burnAmountERC20, props.restResult.burnToken.decimals);
  const burnToken = props.restResult.burnToken.symbol;

  const receiveAmount = roundUnits(props.restResult.estimatedReceiveAmount, props.restResult.receiveToken.decimals);
  const receiveToken = props.restResult.receiveToken.symbol;
  const receiveAddress = props.restResult.burnAddress.receiverAddr;

  return (
    <div className="flex flex-col">
      <h2 className="mb-6 text-xl font-semibold text-white">Ready to send</h2>

      <p className="mb-6 text-sm leading-relaxed text-gray-400">
        You are sending{' '}
        <span className="font-bold text-white">
          {burnAmount} {burnToken}
        </span>{' '}
        to receive{' '}
        <span className="font-bold text-white">
          {receiveAmount} {receiveToken}
        </span>{' '}
        at:
        <br />
        <span className="font-bold break-all text-white ">{receiveAddress}</span>
      </p>

      <p className="mb-3 text-sm leading-relaxed text-gray-400">
        You can send now, you can resume later by uploading your backup file via the Recover option if something goes
        wrong.
      </p>

      <div className="my-4 border-t border-gray-800"></div>

      <WormholeCostDetailsComponent
        broadcasterFee={props.restResult.burnAddress.broadcasterFee}
        proverFee={props.restResult.burnAddress.proverFee}
        protocolFee={props.restResult.burnAddress.revealAmount / POOL_SHARE_INV}
      />

      <button className={`mt-3 w-full rounded-lg bg-brand px-4 py-3 font-semibold text-black`}>Send</button>
    </div>
  );
}
