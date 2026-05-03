'use client';

import { roundEther } from '@/lib/core/utils/round-ether';
import { useState } from 'react';

export default function WormholeCostDetailsComponent(props: {
  proverFee?: bigint;
  broadcasterFee?: bigint;
  protocolFee?: bigint;
  // TODO add swap fee
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const proverFee = props.proverFee ? roundEther(props.proverFee) : '...';
  const broadcasterFee = props.broadcasterFee ? roundEther(props.broadcasterFee) : '...';
  const protocolFee = props.protocolFee ? roundEther(props.protocolFee) : '...';

  return (
    <>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="mb-3 flex w-full cursor-pointer items-center justify-between text-sm font-medium text-white transition-colors"
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
        className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-500">Prover fee</span>
          <span className="text-sm text-gray-400">{proverFee} BETH</span>
        </div>
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-500">Broadcaster fee</span>
          <span className="text-sm text-gray-400">{broadcasterFee} BETH</span>
        </div>
        {/* TODO add swap fee */}
        <div className="flex items-center justify-between py-2">
          <span className="text-sm text-gray-500">Protocol fee</span>
          <span className="text-sm text-gray-400">{protocolFee} BETH</span>
        </div>
      </div>
    </>
  );
}
