"use client"

import { Button } from "@/components/ui/button"
import type { Share } from "./claim-dashboard"

interface ShareCardProps {
  share: Share
  onClaim: (shareId: string) => void
  isClaiming: boolean
}

export function ShareCard({ share, onClaim, isClaiming }: ShareCardProps) {
  const formatNumber = (num: number) => {
    return num.toLocaleString("en-US")
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const now = new Date()
  const isCliffActive = share.cliffEnd > now
  const vestingProgress = Math.min(
    100,
    Math.max(
      0,
      ((now.getTime() - share.vestingStart.getTime()) /
        (share.vestingEnd.getTime() - share.vestingStart.getTime())) *
        100
    )
  )
  const remainingAmount = share.totalAmount - share.claimedAmount - share.claimableAmount

  return (
    <div className="flex flex-col gap-4 rounded-base border border-gray-700 bg-surface1 p-5">
      {/* Header */}
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
            <span className="satoshi-body2 font-bold text-green-400">W</span>
          </div>
          <div>
            <p className="satoshi-body2 font-medium text-white">{share.vestingType} Vesting</p>
            <p className="satoshi-body3 text-gray-400">
              {formatNumber(share.totalAmount)} WORM total
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isCliffActive && (
            <span className="rounded-full bg-orange-500/20 px-3 py-1 text-xs text-orange-400">
              Cliff until {formatDate(share.cliffEnd)}
            </span>
          )}
          {vestingProgress >= 100 && (
            <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
              Fully Vested
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="satoshi-body3 text-gray-400">Vesting Progress</span>
          <span className="satoshi-body3 text-gray-400">{vestingProgress.toFixed(1)}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-700">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{ width: `${vestingProgress}%` }}
          />
        </div>
        <div className="flex justify-between">
          <span className="satoshi-body3 text-gray-500">{formatDate(share.vestingStart)}</span>
          <span className="satoshi-body3 text-gray-500">{formatDate(share.vestingEnd)}</span>
        </div>
      </div>

      {/* Amount breakdown */}
      <div className="grid grid-cols-3 gap-4 border-t border-gray-700 pt-4">
        <div className="flex flex-col gap-1">
          <p className="satoshi-body3 text-gray-400">Claimed</p>
          <p className="satoshi-body2 font-medium text-white">{formatNumber(share.claimedAmount)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="satoshi-body3 text-gray-400">Claimable</p>
          <p className="satoshi-body2 font-medium text-green-400">{formatNumber(share.claimableAmount)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <p className="satoshi-body3 text-gray-400">Locked</p>
          <p className="satoshi-body2 font-medium text-gray-400">{formatNumber(remainingAmount)}</p>
        </div>
      </div>

      {/* Claim button */}
      <div className="flex justify-end border-t border-gray-700 pt-4">
        <Button
          variant="primary"
          onClick={() => onClaim(share.id)}
          disabled={share.claimableAmount === 0 || isClaiming}
          className="min-w-32"
        >
          {isClaiming ? (
            <>
              <span className="mr-2 inline-block animate-spin">&#9696;</span>
              Claiming...
            </>
          ) : share.claimableAmount === 0 ? (
            "Nothing to Claim"
          ) : (
            `Claim ${formatNumber(share.claimableAmount)} WORM`
          )}
        </Button>
      </div>
    </div>
  )
}
