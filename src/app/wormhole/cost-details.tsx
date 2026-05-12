'use client';

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
        className={`overflow-hidden text-[#93A2B7] transition-all duration-300 ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex items-center justify-between py-1">
          <span className="text-sm">Prover fee:</span>
          <span className="text-sm ">{proverFee} BETH</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm">Broadcaster fee:</span>
          <span className="text-sm">{broadcasterFee} BETH</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm">Protocol fee:</span>
          <span className="text-sm">{protocolFee} BETH</span>
        </div>
        {/* TODO add swap fee */}
        <div className="flex items-center justify-between py-1">
          <span className="text-sm">BETH to ETH ratio:</span>
          <span className="text-sm">{ratio}</span>
        </div>
        <div className="flex items-center justify-between py-1">
          <span className="text-sm">Slippage tolerance:</span>
          <span className="text-sm">5%</span>
        </div>
      </div>
    </>
  );
}
