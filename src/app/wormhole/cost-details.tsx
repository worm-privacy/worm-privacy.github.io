'use client';

import InfoIconTooltip from '@/components/tools/info-icon-tooltip';
import { CypherETHQuoterContract } from '@/lib/core/contracts/cyphereth-quoter';
import { roundEther } from '@/lib/core/utils/round-ether';
import { useEffect, useState } from 'react';
import { useClient } from 'wagmi';

export default function WormholeCostDetailsComponent(props: {
  proverFee?: bigint;
  broadcasterFee?: bigint;
  protocolFee?: bigint;
  isExpanded: boolean;
  // TODO add swap fee
}) {
  const [isExpanded, setIsExpanded] = useState(props.isExpanded);

  const proverFee = props.proverFee ? roundEther(props.proverFee) : '...';
  const broadcasterFee = props.broadcasterFee ? roundEther(props.broadcasterFee) : '...';
  const protocolFee = props.protocolFee ? roundEther(props.protocolFee) : '...';

  const [ratio, setRatio] = useState('...');
  const client = useClient();

  useEffect(() => {
    if (client === undefined) return;
    CypherETHQuoterContract.getBETHEtherRatio(client).then((ratio) => {
      setRatio(ratio.toFixed(2));
    });
  }, [client]);

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-1 flex w-full cursor-pointer items-center justify-between text-sm font-medium text-white transition-colors"
      >
        <span>Cost details</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div
        className={`text-[#93A2B7] transition-all duration-300 ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 overflow-hidden opacity-0'}`}
      >
        <div className="flex flex-row py-1">
          <span className="mr-[-4] text-sm">Prover fee</span>
          <InfoIconTooltip content="Worm server fee to generate a zero knowledge proof of burn for you" />
          <span className="ml-1 text-sm">:</span>
          <div className="grow" />
          <span className="text-sm ">{proverFee} BETH</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="mr-[-4] text-sm">Broadcaster fee</span>
          <InfoIconTooltip content="Worm server fee to submit your proof to chain" />
          <span className="ml-1 text-sm">:</span>
          <div className="grow" />
          <span className="text-sm">{broadcasterFee} BETH</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="mr-[-4] text-sm">Protocol fee</span>
          <InfoIconTooltip content="0.5% fee which goes to Worm token stakers" />
          <span className="ml-1 text-sm">:</span>
          <div className="grow" />
          <span className="text-sm">{protocolFee} BETH</span>
        </div>
        {/* TODO add swap fee */}
        <div className="flex items-center justify-between py-1">
          <span className="mr-[-4] text-sm">BETH to ETH ratio</span>
          <InfoIconTooltip content="We swap Burned Ether to Ether for you and thats the ratio" />
          <span className="ml-1 text-sm">:</span>
          <div className="grow" />
          <span className="text-sm">{ratio}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="mr-[-4] text-sm">Slippage tolerance</span>
          <InfoIconTooltip content="Slippage tolerance protects you from unexpected price changes while swapping" />
          <span className="ml-1 text-sm">:</span>
          <div className="grow" />
          <span className="text-sm">5%</span>
        </div>
      </div>
    </>
  );
}
