'use client';

import { useIsMobile } from '@/hooks';
import { cn } from '@/lib';
import { Progress } from '@/ui';

export function NetworkStats() {
  const isMobile = useIsMobile();

  return (
    <section className="container mx-auto flex max-w-185 flex-col gap-8 px-4 py-12 md:px-0 md:pt-0 md:pb-32">
      <span className="flex flex-col justify-start gap-2 md:gap-0">
        <h2
          className={cn('orbitron-h2 text-green-400', {
            'orbitron-h3': isMobile,
          })}
        >
          Network Stats
        </h2>
        <h3
          className={cn('orbitron-h4 text-gray-400', {
            'orbitron-body2': isMobile,
          })}
        >
          WORM is live on Sepolia testnet!
        </h3>
      </span>
      <div
        className="flex flex-col gap-8 rounded-lg border border-green-400/12 bg-surface1 p-6 md:p-8"
        style={{
          boxShadow: '0px 0px 20px 0px rgba(0, 200, 113, 0.12)',
        }}
      >
        <h4 className="orbitron-h5 text-gray-400">Epoch 325</h4>

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-1 flex-col gap-1">
            <p className="orbitron-body2 flex items-center gap-1">
              <span className="text-white">10,321,342‍</span>
              <span className="text-magenta-400">BETH</span>
            </p>
            <Progress value={33} label="6 mins remaining" />
            <p className="satoshi-body2 flex items-center gap-1">
              <span className="text-gray-400">Current epoch reward:</span>
              <span className="orbitron-body3 text-green-400">49.43 WORM</span>
            </p>
          </div>

          <p className="satoshi-h4 flex items-center gap-1 text-white">
            1 <span className="text-blue-400">ETH</span> ~ 3,321 <span className="text-green-400"> WORM</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 grid-rows-4 gap-6 md:grid-cols-2 md:grid-rows-2">
        <div className="flex flex-col items-start gap-0.5">
          <p
            className={cn('satoshi-h4 text-gray-400', {
              'satoshi-h4': isMobile,
            })}
          >
            Total WORM minted
          </p>
          <p
            className={cn('orbitron-h4 text-white', {
              'orbitron-h5': isMobile,
            })}
          >
            21,000,000{' '}
            <span
              className={cn('satoshi-body1 text-green-500', {
                'satoshi-body2': isMobile,
              })}
            >
              WORM
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <p
            className={cn('satoshi-h4 text-gray-400', {
              'satoshi-h4': isMobile,
            })}
          >
            Total ETH burned
          </p>
          <p
            className={cn('orbitron-h4 text-white', {
              'orbitron-h5': isMobile,
            })}
          >
            21,000,000{' '}
            <span
              className={cn('satoshi-body1 text-blue-400', {
                'satoshi-body2': isMobile,
              })}
            >
              ETH
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <p
            className={cn('satoshi-h4 text-gray-400', {
              'satoshi-h4': isMobile,
            })}
          >
            Total WORM supply
          </p>
          <p
            className={cn('orbitron-h4 text-white', {
              'orbitron-h5': isMobile,
            })}
          >
            21,000,000{' '}
            <span
              className={cn('satoshi-body1 text-green-500', {
                'satoshi-body2': isMobile,
              })}
            >
              WORM
            </span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <p
            className={cn('satoshi-h4 text-gray-400', {
              'satoshi-h4': isMobile,
            })}
          >
            Halving time
          </p>
          <p
            className={cn('orbitron-h4 text-white', {
              'orbitron-h5': isMobile,
            })}
          >
            4{' '}
            <span
              className={cn('satoshi-body1 text-gray-400', {
                'satoshi-body2': isMobile,
              })}
            >
              Years
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
