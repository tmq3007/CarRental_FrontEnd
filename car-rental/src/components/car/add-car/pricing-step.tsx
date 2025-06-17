"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Check } from "lucide-react"
import {AddCarDTO} from "@/lib/services/car-api";

interface PricingStepProps {
    carData: AddCarDTO
    updateCarData: (updates: Partial<AddCarDTO>) => void
    onNext: () => void
    onPrev: () => void
}

export default function PricingStep({ carData, updateCarData, onNext, onPrev }: PricingStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleTermsChange = (field: keyof AddCarDTO["TermsOfUse"], value: boolean | string) => {
        updateCarData({
            TermsOfUse: {
                ...carData.TermsOfUse,
                [field]: value,
            },
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!carData.BasePrice.trim()) newErrors.BasePrice = "Base price is required"
        if (!carData.RequiredDeposit.trim()) newErrors.RequiredDeposit = "Required deposit is required"

        // Validate numeric values
        if (carData.BasePrice && isNaN(Number(carData.BasePrice))) {
            newErrors.BasePrice = "Base price must be a valid number"
        }
        if (carData.RequiredDeposit && isNaN(Number(carData.RequiredDeposit))) {
            newErrors.RequiredDeposit = "Required deposit must be a valid number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateForm()) {
            onNext()
        }
    }

    const getFieldClassName = (value: string, errorKey: string) => {
        if (value.trim()) {
            return "border-green-500 bg-green-50 focus:border-green-600 focus:ring-green-200"
        }
        if (errors[errorKey]) {
            return "border-red-500 focus:border-red-500 focus:ring-red-200"
        }
        return "border-gray-200 focus:border-blue-500 focus:ring-blue-200"
    }

    return (
        <div className="space-y-6">
            {/* Base Price */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="BasePrice">Set base price for your car: *</Label>
                    {carData.BasePrice.trim() && <Check className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        id="BasePrice"
                        type="number"
                        value={carData.BasePrice}
                        onChange={(e) => updateCarData({ BasePrice: e.target.value })}
                        className={`flex-1 ${getFieldClassName(carData.BasePrice, "BasePrice")}`}
                        placeholder="Enter price"
                    />
                    <span className="text-gray-600 font-medium">VND/Day</span>
                </div>
                {errors.BasePrice && !carData.BasePrice.trim() && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.BasePrice}
                    </p>
                )}
            </div>

            {/* Required Deposit */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Label htmlFor="RequiredDeposit">Required deposit: *</Label>
                    {carData.RequiredDeposit.trim() && <Check className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        id="RequiredDeposit"
                        type="number"
                        value={carData.RequiredDeposit}
                        onChange={(e) => updateCarData({ RequiredDeposit: e.target.value })}
                        className={`flex-1 ${getFieldClassName(carData.RequiredDeposit, "RequiredDeposit")}`}
                        placeholder="Enter deposit amount"
                    />
                    <span className="text-gray-600 font-medium">VND</span>
                </div>
                {errors.RequiredDeposit && !carData.RequiredDeposit.trim() && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.RequiredDeposit}
                    </p>
                )}
            </div>

            {/* Terms of Use */}
            <div className="space-y-4">
                <Label className="text-lg font-semibold">Terms of use</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="NoSmoking"
                            checked={carData.TermsOfUse.NoSmoking}
                            onCheckedChange={(checked) => handleTermsChange("NoSmoking", checked as boolean)}
                        />
                        <Label htmlFor="NoSmoking">No smoking</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="NoFoodInCar"
                            checked={carData.TermsOfUse.NoFoodInCar}
                            onCheckedChange={(checked) => handleTermsChange("NoFoodInCar", checked as boolean)}
                        />
                        <Label htmlFor="NoFoodInCar">No food in car</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="NoPet"
                            checked={carData.TermsOfUse.NoPet}
                            onCheckedChange={(checked) => handleTermsChange("NoPet", checked as boolean)}
                        />
                        <Label htmlFor="NoPet">No pet</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="Other"
                            checked={carData.TermsOfUse.Other}
                            onCheckedChange={(checked) => handleTermsChange("Other", checked as boolean)}
                        />
                        <Label htmlFor="Other">Other</Label>
                    </div>
                </div>

                {/* Other Terms Text Area */}
                {carData.TermsOfUse.Other && (
                    <div className="space-y-2">
                        <Label htmlFor="OtherTerms">Please specify:</Label>
                        <Textarea
                            id="OtherTerms"
                            value={carData.TermsOfUse.OtherText}
                            onChange={(e) => handleTermsChange("OtherText", e.target.value)}
                            placeholder="Specify other terms..."
                            rows={4}
                        />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6">
                <Button variant="outline" onClick={onPrev} className="text-gray-600">
                    Previous
                </Button>
                <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Next
                </Button>
            </div>
        </div>
    )
}
