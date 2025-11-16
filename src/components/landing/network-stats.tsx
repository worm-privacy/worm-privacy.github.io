'use client';

import { useEffect, useState } from 'react';
import { Contract, BrowserProvider, JsonRpcProvider } from 'ethers';
import { useIsMobile } from '@/hooks/use-is-mobile';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

const CONTRACT_ADDRESS = '0xcBdF9890B5935F01B2f21583d1885CdC8389eb5F';
const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL || '';

const CONTRACT_ABI = [
  {
    inputs: [
      { name: 'user', type: 'address' },
      { name: 'since', type: 'uint256' },
      { name: 'count', type: 'uint256' },
    ],
    name: 'info',
    outputs: [
      {
        components: [
          { name: 'totalWorm', type: 'uint256' },
          { name: 'totalBeth', type: 'uint256' },
          { name: 'currentEpoch', type: 'uint256' },
          { name: 'epochRemainingTime', type: 'uint256' },
          { name: 'since', type: 'uint256' },
          { name: 'userContribs', type: 'uint256[]' },
          { name: 'totalContribs', type: 'uint256[]' },
        ],
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    name: 'currentReward',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
];

export function NetworkStats() {
  const isMobile = useIsMobile();
  const [stats, setStats] = useState({
    totalWorm: '0',
    totalBeth: '0',
    currentEpoch: '0',
    epochRemainingTime: '0',
    currentReward: '0',
    epochBeth: '0',
    wormPrice: '0',
  });
  const [remainingTime, setRemainingTime] = useState(0);
  const [initialEpochTime, setInitialEpochTime] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (!window.ethereum && !RPC_URL) {
          console.error('No Ethereum provider found and missing RPC URL');
          setLoading(false);
          return;
        }

        const provider = window.ethereum ? new BrowserProvider(window.ethereum) : new JsonRpcProvider(RPC_URL);
        const contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const result = await contract.info('0x0000000000000000000000000000000000000000', 0n, 0n);
        const currentRewardResult = await contract.currentReward();

        const currentEpoch = Number(result.currentEpoch);
        const since = Number(result.since);
        const epochIndex = currentEpoch - since - 1;
        const totalContribs = result.totalContribs;
        const epochBeth = epochIndex >= 0 && epochIndex < totalContribs.length ? totalContribs[epochIndex] : 0n;

        const wormPrice = epochBeth > 0n ? (currentRewardResult * BigInt(1e18)) / epochBeth : 0n;

        const epochTimeInSeconds = Number(result.epochRemainingTime);
        setStats({
          totalWorm: result.totalWorm.toString(),
          totalBeth: result.totalBeth.toString(),
          currentEpoch: result.currentEpoch.toString(),
          epochRemainingTime: result.epochRemainingTime.toString(),
          currentReward: currentRewardResult.toString(),
          epochBeth: epochBeth.toString(),
          wormPrice: wormPrice.toString(),
        });
        setRemainingTime(epochTimeInSeconds);
        setInitialEpochTime(600);
      } catch (error) {
        console.error('Error fetching network stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    if (loading || remainingTime <= 0) return;

    const interval = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, remainingTime]);

  const formatTimeDisplay = (seconds) => {
    const secs = Math.max(0, Math.floor(seconds));
    const hours = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const secsRemaining = secs % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secsRemaining.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secsRemaining.toString().padStart(2, '0')}`;
  };

  const progressPercentage = initialEpochTime > 0 ? ((600 - remainingTime) / 600) * 100 : 0;

  const formatNumber = (num) => {
    const value = parseFloat(num) / 1e18;
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

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
        <h4 className="orbitron-h5 text-gray-400">
          {loading ? 'Loading...' : `Epoch ${stats.currentEpoch}`}
        </h4>

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-1 flex-col gap-1">
            <p className="orbitron-body2 flex items-center gap-1">
              <span className="text-white">{loading ? '...' : formatNumber(stats.epochBeth)}</span>
              <span className="text-magenta-400">BETH</span>
            </p>
            <Progress
              value={progressPercentage}
              label={loading ? 'Loading...' : formatTimeDisplay(remainingTime)}
            />
            <p className="satoshi-body2 flex items-center gap-1">
              <span className="text-gray-400">Current epoch reward:</span>
              <span className="orbitron-h4 text-green-400">{loading ? '...' : formatNumber(stats.currentReward)} WORM</span>
            </p>
          </div>

          <p className="satoshi-h4 flex items-center gap-1 text-white">
            1 <span className="text-blue-400">ETH</span> ~ {loading ? '...' : formatNumber(stats.wormPrice)} <span className="text-green-400">WORM</span>
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
            {loading ? '...' : formatNumber(stats.totalWorm)}{' '}
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
            {loading ? '...' : formatNumber(stats.totalBeth)}{' '}
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
