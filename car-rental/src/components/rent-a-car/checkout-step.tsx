import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export function CheckoutStep() {
  return (
    <div className="space-y-6">
      {/* Payment Information - matches third image layout */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Please select your payment method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup defaultValue="wallet" className="space-y-4">
            {/* My Wallet Option */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="wallet" id="wallet" />
              <div className="flex-1">
                <Label htmlFor="wallet" className="text-base font-medium cursor-pointer">
                  My wallet
                </Label>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Current balance:</span>
                  <span className="text-sm font-medium text-green-600">20,000,000 VND</span>
                </div>
              </div>
            </div>

            {/* Cash Option */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="cash" id="cash" />
              <div className="flex-1">
                <Label htmlFor="cash" className="text-base font-medium cursor-pointer">
                  Cash
                </Label>
                <p className="text-sm text-gray-600 mt-1">Our operator will contact you for further instruction</p>
              </div>
            </div>

            {/* Bank Transfer Option */}
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="bank" id="bank" />
              <div className="flex-1">
                <Label htmlFor="bank" className="text-base font-medium cursor-pointer">
                  Bank transfer
                </Label>
                <p className="text-sm text-gray-600 mt-1">Our operator will contact you for further instruction</p>
              </div>
            </div>
          </RadioGroup>

          {/* Credit Card Details - Show when credit card is selected */}
          <div className="mt-6 space-y-4 p-4 border rounded-lg bg-gray-50">
            <h3 className="font-medium">Credit Card Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number *</Label>
                <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardName">Cardholder Name *</Label>
                <Input id="cardName" placeholder="Enter cardholder name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV *</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Terms and Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-indigo-600 hover:underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="license-confirm" />
              <label htmlFor="license-confirm" className="text-sm leading-relaxed">
                I confirm that I have a valid driver's license and meet the minimum age requirement (25 years)
              </label>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox id="marketing" />
              <label htmlFor="marketing" className="text-sm leading-relaxed">
                I would like to receive promotional emails and updates from MyCarRental
              </label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
