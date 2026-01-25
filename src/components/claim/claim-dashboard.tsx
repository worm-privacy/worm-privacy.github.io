"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/ui/icons"
import { ShareCard } from "./share-card"
import { ClaimSummary } from "./claim-summary"

interface WalletInfo {
  address: string
  isConnected: boolean
}

export interface Share {
  id: string
  totalAmount: number
  claimableAmount: number
  claimedAmount: number
  vestingStart: Date
  vestingEnd: Date
  cliffEnd: Date
  vestingType: string
}

// Mock data generator
function generateMockShares(): Share[] {
  const now = new Date()
  return [
    {
      id: "share-1",
      totalAmount: 50000,
      claimableAmount: 12500,
      claimedAmount: 12500,
      vestingStart: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      vestingEnd: new Date(now.getTime() + 270 * 24 * 60 * 60 * 1000),
      cliffEnd: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
      vestingType: "Linear",
    },
    {
      id: "share-2",
      totalAmount: 100000,
      claimableAmount: 0,
      claimedAmount: 0,
      vestingStart: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      vestingEnd: new Date(now.getTime() + 335 * 24 * 60 * 60 * 1000),
      cliffEnd: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      vestingType: "Linear",
    },
    {
      id: "share-3",
      totalAmount: 25000,
      claimableAmount: 25000,
      claimedAmount: 0,
      vestingStart: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
      vestingEnd: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      cliffEnd: new Date(now.getTime() - 335 * 24 * 60 * 60 * 1000),
      vestingType: "Cliff",
    },
  ]
}

export function ClaimDashboard() {
  const [wallet, setWallet] = useState<WalletInfo | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shares, setShares] = useState<Share[]>([])
  const [claimingId, setClaimingId] = useState<string | null>(null)

  const connectWallet = async () => {
    try {
      setError(null)
      setIsConnecting(true)

      if (!window.ethereum) {
        setError("MetaMask is not installed. Please install MetaMask to continue.")
        return
      }

      const accounts = (await window.ethereum.request({
        method: "eth_requestAccounts",
      })) as string[]

      if (accounts && accounts.length > 0) {
        setWallet({ address: accounts[0], isConnected: true })
        // Load mock shares after connecting
        setShares(generateMockShares())
      }
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("User rejected")) {
          setError("You rejected the connection request.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Failed to connect wallet. Please try again.")
      }
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setWallet(null)
    setShares([])
  }

  const handleClaim = async (shareId: string) => {
    setClaimingId(shareId)
    
    // Simulate claiming delay
    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    // Update share after claiming
    setShares((prev) =>
      prev.map((share) =>
        share.id === shareId
          ? {
              ...share,
              claimedAmount: share.claimedAmount + share.claimableAmount,
              claimableAmount: 0,
            }
          : share
      )
    )
    
    setClaimingId(null)
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const totalAmount = shares.reduce((sum, s) => sum + s.totalAmount, 0)
  const totalClaimable = shares.reduce((sum, s) => sum + s.claimableAmount, 0)
  const totalClaimed = shares.reduce((sum, s) => sum + s.claimedAmount, 0)
  const totalRemaining = totalAmount - totalClaimed - totalClaimable

  return (
    <section className="flex w-full flex-col items-center justify-center gap-10 px-4 py-12 md:container md:mx-auto md:max-w-280 md:px-0 md:pt-0 md:pb-32">
      <div className="flex w-full flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="satoshi-h1 mb-4 text-white">Claim WORM Tokens</h1>
          <p className="satoshi-body2 text-gray-400">
            Connect your wallet to view and claim your vested WORM tokens
          </p>
        </div>

        {!wallet?.isConnected ? (
          <Card className="w-full border-green-500/30 bg-surface1 md:w-max md:min-w-96">
            <CardHeader>
              <CardTitle className="text-center text-green-400">Connect Wallet</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                className="w-full px-6 py-3 md:w-max"
                variant="primary"
              >
                {isConnecting ? (
                  <>
                    <span className="mr-2 inline-block animate-spin">&#9696;</span>
                    Connecting...
                  </>
                ) : (
                  <>
                    <Icons.wallet className="mr-2 h-4 w-4" />
                    Connect MetaMask
                  </>
                )}
              </Button>

              {error && (
                <div className="w-full rounded-base border border-orange-500/50 bg-orange-500/10 p-3 text-center">
                  <p className="satoshi-body3 text-orange-400">{error}</p>
                </div>
              )}

              <p className="satoshi-body3 text-center text-gray-500">
                Make sure you have MetaMask installed in your browser
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="flex w-full flex-col gap-6">
            {/* Connected wallet header */}
            <div className="flex flex-col items-center justify-between gap-4 rounded-base border border-green-500/30 bg-surface1 p-4 md:flex-row">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500/20">
                  <Icons.wallet className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="satoshi-body3 text-gray-400">Connected Wallet</p>
                  <p className="satoshi-body2 font-medium text-white">{formatAddress(wallet.address)}</p>
                </div>
              </div>
              <Button variant="outline" onClick={disconnectWallet} className="text-gray-400 hover:text-white bg-transparent">
                Disconnect
              </Button>
            </div>

            {/* Summary */}
            <ClaimSummary
              totalAmount={totalAmount}
              totalClaimable={totalClaimable}
              totalClaimed={totalClaimed}
              totalRemaining={totalRemaining}
            />

            {/* Shares list */}
            <div className="flex flex-col gap-4">
              <h2 className="satoshi-h4 text-white">Your Shares ({shares.length})</h2>
              {shares.map((share) => (
                <ShareCard
                  key={share.id}
                  share={share}
                  onClaim={handleClaim}
                  isClaiming={claimingId === share.id}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
