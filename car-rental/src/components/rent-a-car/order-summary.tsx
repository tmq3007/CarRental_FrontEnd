"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Shield, Check, Lock } from "lucide-react"

interface OrderSummaryProps {
  currentStep: number
  onNextStep: () => void
}

export function OrderSummary({ currentStep, onNextStep }: OrderSummaryProps) {
  return (
    <div className="sticky top-16">
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Car Image and Details */}
          <div className="flex items-center space-x-3">
            <img
              src="/placeholder.svg?height=60&width=80"
              alt="Mercedes S-Class"
              className="h-15 w-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">Mercedes S-Class</h3>
              <p className="text-sm text-gray-600">Luxury Sedan</p>
            </div>
          </div>

          <Separator />

          {/* Rental Details */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Pick-up</span>
              <span>Mar 15, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Drop-off</span>
              <span>Mar 18, 2024</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span>3 days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location</span>
              <span>New York City</span>
            </div>
          </div>

          <Separator />

          {/* Pricing */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Car Rental (3 days)</span>
              <span>$897.00</span>
            </div>
            <div className="flex justify-between">
              <span>Insurance Coverage</span>
              <span>$87.00</span>
            </div>
            <div className="flex justify-between">
              <span>Additional Driver</span>
              <span>$45.00</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & Fees</span>
              <span>$103.00</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>$1,132.00</span>
          </div>

          {/* Promo Code */}
          <div className="space-y-2">
            <div className="flex space-x-2">
              <Input placeholder="Promotion Code" className="flex-1" />
              <Button variant="outline" className="bg-indigo-600 text-white hover:bg-indigo-700">
                Apply
              </Button>
            </div>
          </div>

          <Button className="w-full bg-indigo-600 hover:bg-indigo-700" onClick={onNextStep}>
            {currentStep === 1 ? "Proceed to Checkout" : "Complete Booking"}
          </Button>

          {/* Security Features */}
          <div className="space-y-2 text-xs text-gray-600">
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>Free cancellation up to 24 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <span>No hidden fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="h-4 w-4 text-green-500" />
              <span>Secure payment processing</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 rounded-lg bg-orange-50 p-3">
            <Shield className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-orange-700">Your payment is secured with 256-bit SSL encryption</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
