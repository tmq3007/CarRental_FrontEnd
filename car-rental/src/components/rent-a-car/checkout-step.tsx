"use client"

import { forwardRef, useImperativeHandle, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  Banknote,
  RefreshCw,
  Shield,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  CreditCard,
  Info,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { RootState } from "@/lib/store"
import { useSelector } from "react-redux"
import { useGetWalletBalanceQuery } from "@/lib/services/wallet-api"
import { formatCurrency } from "@/lib/hook/useFormatCurrency"

// Mock interfaces for demonstration
interface BookingState {
  rentalDays?: number
}

interface CarVO_Detail {
  basePrice?: number
}

interface CheckoutStepProps {
  onUpdatePaymentDetails: (details: { paymentType?: string; deposit?: number }) => void
  paymentDetails: { paymentType?: string; deposit?: number }
  bookingState: BookingState
  car?: CarVO_Detail
  onNextStep: () => void
}

export interface CheckoutStepHandle {
  validateForm: () => boolean
}

export const CheckoutStep = forwardRef<CheckoutStepHandle, CheckoutStepProps>(
  ({ car, bookingState, onUpdatePaymentDetails, paymentDetails, onNextStep }, ref) => {
    const [paymentType, setPaymentType] = useState(paymentDetails.paymentType || "")
    const [deposit, setDeposit] = useState((0.3 * (bookingState.rentalDays || 0) * (car?.basePrice || 0)).toString())
    const [termsAccepted, setTermsAccepted] = useState(false)
    const [licenseConfirmed, setLicenseConfirmed] = useState(false)
    const [marketingOptIn, setMarketingOptIn] = useState(false)
    const [errors, setErrors] = useState<{
      paymentType?: string
      deposit?: string
      terms?: string
      submit?: string
    }>({})

    const [maxDeposite] = useState((bookingState.rentalDays || 0) * (car?.basePrice || 0))
    const [minDeposite] = useState(0.3 * (bookingState.rentalDays || 0) * (car?.basePrice || 0))
    const [isRefreshing, setIsRefreshing] = useState(false)

    const userId = useSelector((state: RootState) => state.user.id);

    // Fetch wallet balance with userId
    const { data: walletResponse, isLoading, isError, refetch } = useGetWalletBalanceQuery(userId, {
      skip: !userId, // Skip query if userId is not provided
    });
    const walletBalance = walletResponse?.data?.balance || 0; // Extract balance from ApiResponse

    const validateForm = () => {
      const newErrors: typeof errors = {}
      if (!paymentType) newErrors.paymentType = "Please select a payment method."
      if (!deposit || isNaN(+deposit) || +deposit <= 0) newErrors.deposit = "Please enter a valid deposit amount."
      if (paymentType === "wallet" && walletBalance < +deposit) {
        newErrors.deposit = "Insufficient balance. Please top up your wallet."
      }
      if (!termsAccepted) newErrors.terms = "You must agree to the terms."
      if (!licenseConfirmed) newErrors.submit = "You must confirm your driver's license."
      setErrors(newErrors)
      return Object.keys(newErrors).length === 0
    }

    const handleRefresh = async () => {
      setIsRefreshing(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsRefreshing(false)
    }



    useImperativeHandle(ref, () => ({ validateForm }))

    return (
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Payment Method Selection */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
              <CreditCard className="h-6 w-6 text-blue-600" />
              Payment Method
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Choose how you'd like to pay for your rental</p>
          </CardHeader>
          <CardContent className="p-6">
            <RadioGroup
              value={paymentType}
              onValueChange={(value) => {
                setPaymentType(value)
                setErrors((prev) => ({ ...prev, paymentType: undefined }))
                onUpdatePaymentDetails({ paymentType: value, deposit: Number(deposit) || undefined })
              }}
              className="space-y-4"
            >
              {/* Wallet Payment Option */}
              <div
                className={cn(
                  "relative p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-md",
                  paymentType === "wallet"
                    ? "border-blue-500 bg-blue-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="wallet" id="wallet" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Wallet className="h-5 w-5 text-blue-600" />
                      <Label htmlFor="wallet" className="text-lg font-semibold cursor-pointer text-gray-800">
                        My Wallet
                      </Label>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Instant
                      </Badge>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-100">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Available Balance:</span>
                        <div className="flex items-center gap-2">
                          {isLoading ? (
                            <div className="flex items-center gap-2">
                              <RefreshCw className="h-4 w-4 animate-spin text-gray-400" />
                              <span className="text-sm text-gray-500">Loading...</span>
                            </div>
                          ) : isError ? (
                            <div className="flex items-center gap-2">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <span className="text-sm text-red-500">Error loading</span>
                            </div>
                          ) : (
                            <span className="text-lg font-bold text-green-600">{formatCurrency(walletBalance)}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRefresh}
                          disabled={isRefreshing}
                          className="flex items-center gap-2 bg-transparent"
                        >
                          <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                          Refresh
                        </Button>

                        {paymentType === "wallet" && walletBalance < +deposit && (
                          <Button
                            variant="default"
                            size="sm"
                            className="flex items-center gap-2"
                            onClick={() => window.open(`/wallet/topup?userId=${userId}`, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                            Top Up Wallet
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cash Payment Option */}
              <div
                className={cn(
                  "relative p-6 border-2 rounded-xl transition-all duration-200 hover:shadow-md",
                  paymentType === "cash"
                    ? "border-green-500 bg-green-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300",
                )}
              >
                <div className="flex items-start space-x-4">
                  <RadioGroupItem value="cash" id="cash" className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Banknote className="h-5 w-5 text-green-600" />
                      <Label htmlFor="cash" className="text-lg font-semibold cursor-pointer text-gray-800">
                        Cash Payment
                      </Label>
                      <Badge variant="outline" className="border-orange-200 text-orange-700">
                        Manual Process
                      </Badge>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <Info className="h-4 w-4 mt-0.5 text-blue-500" />
                      <p>Our operator will contact you within 24 hours for payment instructions and pickup details.</p>
                    </div>
                  </div>
                </div>
              </div>
            </RadioGroup>

            {errors.paymentType && (
              <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <p className="text-red-600 text-sm">{errors.paymentType}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Deposit Section */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
              <Shield className="h-6 w-6 text-green-600" />
              Security Deposit
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Refundable deposit to secure your booking</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">Minimum Required</p>
                    <p className="text-lg font-bold text-blue-600">{formatCurrency(minDeposite)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">Maximum Allowed</p>
                    <p className="text-lg font-bold text-green-600">{formatCurrency(maxDeposite)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-600 font-medium">Recommended</p>
                    <p className="text-lg font-bold text-purple-600">{formatCurrency(minDeposite * 1.5)}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit" className="text-base font-medium">
                  Deposit Amount *
                </Label>
                <div className="relative">
                  <Input
                    id="deposit"
                    type="number"
                    step={100000}
                    placeholder="Enter deposit amount"
                    value={deposit}
                    min={minDeposite}
                    max={maxDeposite}
                    onChange={(e) => {
                      const value = Number(e.target.value)
                      if (value >= minDeposite && value <= maxDeposite) {
                        setDeposit(e.target.value)
                        setErrors((prev) => ({ ...prev, deposit: undefined }))
                        onUpdatePaymentDetails({ paymentType, deposit: value })
                      } else {
                        if (value < minDeposite) {
                          setDeposit(minDeposite.toString())
                          setErrors((prev) => ({
                            ...prev,
                            deposit: `Minimum deposit is ${formatCurrency(minDeposite)}`,
                          }))
                        }
                        if (value > maxDeposite) {
                          setDeposit(maxDeposite.toString())
                          setErrors((prev) => ({
                            ...prev,
                            deposit: `Maximum deposit is ${formatCurrency(maxDeposite)}`,
                          }))
                        }
                      }
                    }}
                    className="text-lg font-semibold pr-16"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                    VND
                  </span>
                </div>
                {errors.deposit && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-red-600 text-sm">{errors.deposit}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl text-gray-800">
              <CheckCircle2 className="h-6 w-6 text-purple-600" />
              Terms & Agreements
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">Please review and accept our terms to continue</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200",
                  termsAccepted ? "border-green-200 bg-green-50" : "border-gray-200",
                )}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => {
                      setTermsAccepted(checked as boolean)
                      setErrors((prev) => ({ ...prev, terms: undefined }))
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                    I have read and agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Terms and Conditions
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline font-medium">
                      Privacy Policy
                    </a>
                  </label>
                </div>
                {errors.terms && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-red-600 text-sm">{errors.terms}</p>
                  </div>
                )}
              </div>

              <div
                className={cn(
                  "p-4 rounded-lg border-2 transition-all duration-200",
                  licenseConfirmed ? "border-green-200 bg-green-50" : "border-gray-200",
                )}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="license-confirm"
                    checked={licenseConfirmed}
                    onCheckedChange={(checked) => {
                      setLicenseConfirmed(checked as boolean)
                      setErrors((prev) => ({ ...prev, submit: undefined }))
                    }}
                    className="mt-1"
                  />
                  <label htmlFor="license-confirm" className="text-sm leading-relaxed cursor-pointer">
                    I confirm that I have a valid driver's license and meet the minimum age requirement (25 years)
                  </label>
                </div>
                {errors.submit && (
                  <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 border border-red-200 rounded">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <p className="text-red-600 text-sm">{errors.submit}</p>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-lg border border-gray-200">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={marketingOptIn}
                    onCheckedChange={(checked) => setMarketingOptIn(checked as boolean)}
                    className="mt-1"
                  />
                  <label htmlFor="marketing" className="text-sm leading-relaxed cursor-pointer text-gray-600">
                    I would like to receive promotional emails and updates about special offers
                    <span className="text-xs text-gray-500 block mt-1">(Optional - You can unsubscribe anytime)</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },
)

CheckoutStep.displayName = "CheckoutStep"
