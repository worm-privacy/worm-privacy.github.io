'use client';

import { Icons } from '@/components/ui/icons';
import { useState } from 'react';
import { WormholeRestComponentResult } from './rest';

export default function WormholeLoadingComponent(props: { restResult: WormholeRestComponentResult }) {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div
      className="flex flex-col  bg-[#0d0f17]"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      <div className="mb-5 flex items-center gap-3">
        <Icons.spiral fill="white" />
        <h2 className="text-lg font-semibold tracking-wide text-white">Worming the hole, Just a few moments</h2>
      </div>

      <p className="mb-8 text-sm leading-relaxed text-gray-400">
        Please don&apos;t close the tab until the process completed.
      </p>
      <div className="space-y-5">
        {STATUS_STEPS.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="shrink-0">
              {index < currentStep && <Icons.checkboxChecked fill="white" />}
              {index === currentStep && <Icons.spinner fill="white" className="animate-spin" />}
              {index > currentStep && <Icons.checkbox fill="white" />}
            </div>

            <span
              className={`text-sm transition-colors duration-300 ${
                index > currentStep
                  ? 'text-gray-500'
                  : index == currentStep
                    ? 'font-medium text-emerald-400'
                    : 'text-gray-300'
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const STATUS_STEPS = ['Sending to burn address', 'Generating proof', 'Submitting proof'];
