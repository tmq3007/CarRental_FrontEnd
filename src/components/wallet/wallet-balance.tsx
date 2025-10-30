"use client"

import { Button } from "@/components/ui/button"

interface WalletBalanceProps {
    balance: string
    onWithdraw: () => void
    onTopup: () => void
}

export function WalletBalance({ balance, onWithdraw, onTopup }: WalletBalanceProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-600 mb-2">Your current balance:</p>
                    <p className="text-3xl font-bold text-green-600">{balance}</p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        className="bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200"
                        onClick={onWithdraw}
                    >
                        Withdraw
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={onTopup}>
                        Top-up
                    </Button>
                </div>
            </div>
        </div>
    )
}
