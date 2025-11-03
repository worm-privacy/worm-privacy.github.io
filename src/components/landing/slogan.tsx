export function SloganSection() {
  return (
    <section className="container mx-auto flex max-w-232.5 flex-col items-center justify-center gap-6 pb-32">
      <div className="flex w-full items-center justify-center rounded-2xl border border-gray-400/24 py-12">
        <h1 className="orbitron-h2 text-blue-400">
          <span>ETH dies,</span> <span className="text-green-400">WORM lives</span>
        </h1>
      </div>

      <div className="grid w-full grid-cols-2 gap-6">
        <div className="orbitron-h5 corner-only flex h-45.5 flex-col items-center justify-center rounded-base border-2 border-blue-500 text-gray-400">
          <span>Private</span>
          <h3 className="orbitron-h3 text-green-400">Proof of Burn</h3>
          <span>mining</span>
        </div>
        <div className="orbitron-h5 corner-only flex h-45.5 flex-col items-center justify-center rounded-base border-2 border-blue-500 text-gray-400">
          <span>Powered by</span>
          <h3 className="orbitron-h3 text-green-400">zkSNARKs</h3>
        </div>
      </div>
    </section>
  );
}
