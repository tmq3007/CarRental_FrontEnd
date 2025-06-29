"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

interface CheckoutStepProps {
  onUpdatePaymentDetails: (details: { paymentType?: string; deposit?: number }) => void;
  paymentDetails: { paymentType?: string; deposit?: number };
  onNextStep: () => void;
}

export function CheckoutStep({ onUpdatePaymentDetails, paymentDetails, onNextStep }: CheckoutStepProps) {
  const [paymentType, setPaymentType] = useState(paymentDetails.paymentType || "");
  const [deposit, setDeposit] = useState(paymentDetails.deposit?.toString() || "");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [licenseConfirmed, setLicenseConfirmed] = useState(false);
  const [errors, setErrors] = useState<{ paymentType?: string; deposit?: string; terms?: string }>({});

  const validateForm = () => {
    const newErrors: { paymentType?: string; deposit?: string; terms?: string } = {};
    if (!paymentType) {
      newErrors.paymentType = "Please select a payment method.";
    }
    if (!deposit || isNaN(parseFloat(deposit)) || parseFloat(deposit) <= 0) {
      newErrors.deposit = "Please enter a valid deposit amount.";
    }
    if (!termsAccepted) {
      newErrors.terms = "You must agree to the terms and conditions.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }
    onUpdatePaymentDetails({
      paymentType,
      deposit: parseFloat(deposit) || 0,
    });
    onNextStep();
  };

  return (
    <div className="space-y-6">
      {/* Payment Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Please select your payment method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={paymentType}
            onValueChange={(value) => {
              setPaymentType(value);
              setErrors((prev) => ({ ...prev, paymentType: undefined }));
            }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="wallet" id="wallet" />
              <div className="flex-1">
                <Label htmlFor="wallet" className="text-base font-medium cursor-pointer">
                  My Wallet
                </Label>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Current balance:</span>
                  <span className="text-sm font-medium text-green-600">20,000,000 VND</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="cash" id="cash" />
              <div className="flex-1">
                <Label htmlFor="cash" className="text-base font-medium cursor-pointer">
                  Cash
                </Label>
                <p className="text-sm text-gray-600 mt-1">Our operator will contact you for further instruction</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="bank_transfer" id="bank" />
              <div className="flex-1">
                <Label htmlFor="bank" className="text-base font-medium cursor-pointer">
                  Bank Transfer
                </Label>
                <p className="text-sm text-gray-600 mt-1">Our operator will contact you for further instruction</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <div className="flex-1">
                <Label htmlFor="credit_card" className="text-base font-medium cursor-pointer">
                  Credit Card
                </Label>
                <p className="text-sm text-gray-600 mt-1">Secure payment with your credit card</p>
              </div>
            </div>
          </RadioGroup>
          {errors.paymentType && <p className="text-red-500 text-sm mt-2">{errors.paymentType}</p>}

          {/* Credit Card Details - Show when credit_card is selected */}
          {paymentType === "credit_card" && (
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
          )}
        </CardContent>
      </Card>

      {/* Deposit Input */}
      <Card>
        <CardHeader>
          <CardTitle>Deposit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="deposit">Deposit Amount *</Label>
            <Input
              id="deposit"
              type="number"
              placeholder="Enter deposit amount"
              value={deposit}
              onChange={(e) => {
                setDeposit(e.target.value);
                setErrors((prev) => ({ ...prev, deposit: undefined }));
              }}
            />
            {errors.deposit && <p className="text-red-500 text-sm">{errors.deposit}</p>}
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
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => {
                  setTermsAccepted(checked as boolean);
                  setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
              />
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
            {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="license-confirm"
                checked={licenseConfirmed}
                onCheckedChange={(checked) => setLicenseConfirmed(checked as boolean)}
              />
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

      <Button onClick={handleSubmit} className="w-full bg-indigo-600 hover:bg-indigo-700">
        Continue
      </Button>
    </div>
  );
}