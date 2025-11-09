'use client';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import Svg from 'react-inlinesvg';
import { ROADMAP } from './constant';
import { Roadmap } from './type';

function RoadmapSection() {
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto flex max-w-185 flex-col gap-6 pb-32">
      <h1
        className={cn('orbitron-h2 text-green-400', {
          'orbitron-h3': isMobile,
        })}
      >
        Roadmap
      </h1>

      <ul className="flex flex-col gap-6">
        {ROADMAP.map((step) => (
          <RoadmapStep key={step.title} {...step} />
        ))}
      </ul>
    </section>
  );
}

function RoadmapStep({ title, status, deadline, description }: Roadmap) {
  const isMobile = useIsMobile();

  return (
    <li
      className={cn('grid w-full grid-rows-2 gap-3 rounded-lg border border-green-400/12 bg-surface1 p-8 md:gap-4', {
        'grid-rows-1': status !== 'active',
      })}
    >
      <div
        className={cn('grid w-full grid-cols-1 gap-6', {
          'grid-cols-[1.25rem_1fr]': status === 'active' || status === 'passed',
        })}
      >
        {status === 'active' ? (
          <Svg src="/assets/icons/check.svg" className="self-center" />
        ) : status === 'passed' ? (
          <Svg src="/assets/icons/checks.svg" className="self-center" />
        ) : (
          <></>
        )}
        <span className="flex w-full flex-col-reverse items-start justify-start gap-1 md:flex-row md:items-center md:justify-between md:gap-6">
          <h4
            className={cn('text-green-400', {
              'text-green-400/36': status === 'passed',
            })}
          >
            {title}
          </h4>
          <span className="text-orange-400">{deadline}</span>
        </span>
      </div>
      {status === 'active' ? (
        <p
          className={cn('satoshi-body1 pl-11 text-gray-400', {
            'satoshi-body2': isMobile,
          })}
        >
          {description}
        </p>
      ) : null}
    </li>
  );
}

export { RoadmapSection };
