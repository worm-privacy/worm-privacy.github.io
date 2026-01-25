"use client"

interface ClaimSummaryProps {
  totalAmount: number
  totalClaimable: number
  totalClaimed: number
  totalRemaining: number
}

export function ClaimSummary({ totalAmount, totalClaimable, totalClaimed, totalRemaining }: ClaimSummaryProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US")
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="flex flex-col gap-1 rounded-base border border-gray-700 bg-surface1 p-4">
        <p className="satoshi-body3 text-gray-400">Total Allocation</p>
        <p className="satoshi-h4 text-white">{formatNumber(totalAmount)}</p>
        <p className="satoshi-body3 text-gray-500">WORM</p>
      </div>
      
      <div className="flex flex-col gap-1 rounded-base border border-green-500/30 bg-green-500/5 p-4">
        <p className="satoshi-body3 text-gray-400">Claimable Now</p>
        <p className="satoshi-h4 text-green-400">{formatNumber(totalClaimable)}</p>
        <p className="satoshi-body3 text-gray-500">WORM</p>
      </div>
      
      <div className="flex flex-col gap-1 rounded-base border border-gray-700 bg-surface1 p-4">
        <p className="satoshi-body3 text-gray-400">Already Claimed</p>
        <p className="satoshi-h4 text-white">{formatNumber(totalClaimed)}</p>
        <p className="satoshi-body3 text-gray-500">WORM</p>
      </div>
      
      <div className="flex flex-col gap-1 rounded-base border border-gray-700 bg-surface1 p-4">
        <p className="satoshi-body3 text-gray-400">Locked / Vesting</p>
        <p className="satoshi-h4 text-gray-400">{formatNumber(totalRemaining)}</p>
        <p className="satoshi-body3 text-gray-500">WORM</p>
      </div>
    </div>
  )
}
