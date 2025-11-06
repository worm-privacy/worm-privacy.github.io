import { Progress } from '@/ui';

export function NetworkStats() {
  return (
    <section className="container mx-auto flex max-w-184 flex-col gap-8 pb-32">
      <span className="flex flex-col justify-start">
        <h1 className="orbitron-h2 text-green-400">Network Sats</h1>
        <h3 className="orbitron-h4 text-gray-400">WORM is live on Sepolia testnet!</h3>
      </span>
      <div className="flex flex-col gap-8 bg-surface-1 p-8">
        <h4 className="orbitron-h5 text-gray-400">Epoch 325</h4>

        <div className="flex flex-1 flex-col items-center justify-center gap-4">
          <div className="flex w-full flex-1 flex-col gap-1">
            <p className="orbitron-body-3 flex items-center gap-1">
              <span className="text-white">10,321,342‍</span>
              <span className="text-blue-400">BETH</span>
            </p>
            <Progress value={33} label="6 mins remaining" />
            <p className="satoshi-body-2 flex items-center gap-1">
              <span className="text-gray-400">Current epoch reward:</span>
              <span className="orbitron-body-3 text-green-400">49.43 WORM</span>
            </p>
          </div>

          <p className="satoshi-h4 flex items-center gap-1 text-white">
            1 <span className="text-blue-400">ETH</span> ~ 3,321 <span className="text-green-400"> WORM</span>
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-6">
        <div className="flex flex-col items-start gap-0.5">
          <p className="satoshi-h4 text-gray-400">Total WORM minted</p>
          <p className="orbitron-h4 text-white">
            21,000,000 <span className="satoshi-body-1 text-green-500">WORM</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <p className="satoshi-h4 text-gray-400">Total ETH burned</p>
          <p className="orbitron-h4 text-white">
            21,000,000 <span className="satoshi-body-1 text-blue-400">ETH</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <p className="satoshi-h4 text-gray-400">Total WORM supply</p>
          <p className="orbitron-h4 text-white">
            21,000,000 <span className="satoshi-body-1 text-green-500">WORM</span>
          </p>
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <p className="satoshi-h4 text-gray-400">Halving time</p>
          <p className="orbitron-h4 text-white">
            4 <span className="satoshi-body-1 text-gray-400">Years</span>
          </p>
        </div>
      </div>
    </section>
  );
}
