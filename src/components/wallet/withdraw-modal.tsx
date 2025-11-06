"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WithdrawModalProps {
    isOpen: boolean
    currentBalance: number
    withdrawAmount: string
    onClose: () => void
    onAmountChange: (amount: string) => void
    onConfirm: () => void
}

export function WithdrawModal({
                                  isOpen,
                                  currentBalance,
                                  withdrawAmount,
                                  onClose,
                                  onAmountChange,
                                  onConfirm,
                              }: WithdrawModalProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("vi-VN").format(amount)
    }

    const isValidAmount =
        withdrawAmount && Number.parseInt(withdrawAmount) > 0 && Number.parseInt(withdrawAmount) <= currentBalance

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-center">Withdraw</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <p className="text-center text-sm text-gray-600 mb-4">
                        Your current balance is {formatCurrency(currentBalance)}. Please enter the amount to withdraw from your
                        wallet
                    </p>
                    <div className="space-y-3">
                        <Input
                            type="number"
                            placeholder="Enter amount"
                            value={withdrawAmount}
                            onChange={(e) => onAmountChange(e.target.value)}
                            className="w-full"
                            min="1"
                            max={currentBalance}
                        />
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" size="sm" onClick={() => onAmountChange("2000000")} className="text-xs">
                                2,000,000
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onAmountChange("5000000")} className="text-xs">
                                5,000,000
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => onAmountChange("10000000")} className="text-xs">
                                10,000,000
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onAmountChange(currentBalance.toString())}
                                className="text-xs"
                            >
                                All balance
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter className="flex gap-2">
                    <Button variant="outline" onClick={onClose} className="flex-1">
                        Cancel
                    </Button>
                    <Button onClick={onConfirm} disabled={!isValidAmount} className="flex-1">
                        OK
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
