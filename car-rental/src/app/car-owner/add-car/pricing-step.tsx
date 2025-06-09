"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle } from "lucide-react"
import { CarData } from "@/app/car-owner/add-car/page"


interface PricingStepProps {
    carData: CarData
    updateCarData: (updates: Partial<CarData>) => void
    onNext: () => void
    onPrev: () => void
}

export default function PricingStep({ carData, updateCarData, onNext, onPrev }: PricingStepProps) {
    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleTermsChange = (field: keyof CarData["termsOfUse"], value: boolean | string) => {
        updateCarData({
            termsOfUse: {
                ...carData.termsOfUse,
                [field]: value,
            },
        })
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!carData.basePrice.trim()) newErrors.basePrice = "Base price is required"
        if (!carData.requiredDeposit.trim()) newErrors.requiredDeposit = "Required deposit is required"

        // Validate numeric values
        if (carData.basePrice && isNaN(Number(carData.basePrice))) {
            newErrors.basePrice = "Base price must be a valid number"
        }
        if (carData.requiredDeposit && isNaN(Number(carData.requiredDeposit))) {
            newErrors.requiredDeposit = "Required deposit must be a valid number"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleNext = () => {
        if (validateForm()) {
            onNext()
        }
    }

    return (
        <div className="space-y-6">
            {/* Base Price */}
            <div className="space-y-2">
                <Label htmlFor="basePrice">Set base price for your car:</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        id="basePrice"
                        type="number"
                        value={carData.basePrice}
                        onChange={(e) => updateCarData({ basePrice: e.target.value })}
                        className={`flex-1 ${errors.basePrice ? "border-red-500" : ""}`}
                        placeholder="Enter price"
                    />
                    <span className="text-gray-600 font-medium">VND/Day</span>
                </div>
                {errors.basePrice && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.basePrice}
                    </p>
                )}
            </div>

            {/* Required Deposit */}
            <div className="space-y-2">
                <Label htmlFor="requiredDeposit">Required deposit:</Label>
                <div className="flex items-center space-x-2">
                    <Input
                        id="requiredDeposit"
                        type="number"
                        value={carData.requiredDeposit}
                        onChange={(e) => updateCarData({ requiredDeposit: e.target.value })}
                        className={`flex-1 ${errors.requiredDeposit ? "border-red-500" : ""}`}
                        placeholder="Enter deposit amount"
                    />
                    <span className="text-gray-600 font-medium">VND</span>
                </div>
                {errors.requiredDeposit && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.requiredDeposit}
                    </p>
                )}
            </div>

            {/* Terms of Use */}
            <div className="space-y-4">
                <Label className="text-lg font-semibold">Terms of use</Label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="noSmoking"
                            checked={carData.termsOfUse.noSmoking}
                            onCheckedChange={(checked) => handleTermsChange("noSmoking", checked as boolean)}
                        />
                        <Label htmlFor="noSmoking">No smoking</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="noFoodInCar"
                            checked={carData.termsOfUse.noFoodInCar}
                            onCheckedChange={(checked) => handleTermsChange("noFoodInCar", checked as boolean)}
                        />
                        <Label htmlFor="noFoodInCar">No food in car</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="noPet"
                            checked={carData.termsOfUse.noPet}
                            onCheckedChange={(checked) => handleTermsChange("noPet", checked as boolean)}
                        />
                        <Label htmlFor="noPet">No pet</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="other"
                            checked={carData.termsOfUse.other}
                            onCheckedChange={(checked) => handleTermsChange("other", checked as boolean)}
                        />
                        <Label htmlFor="other">Other</Label>
                    </div>
                </div>

                {/* Other Terms Text Area */}
                {carData.termsOfUse.other && (
                    <div className="space-y-2">
                        <Label htmlFor="otherTerms">Please specify:</Label>
                        <Textarea
                            id="otherTerms"
                            value={carData.termsOfUse.otherText}
                            onChange={(e) => handleTermsChange("otherText", e.target.value)}
                            placeholder="Specify other terms..."
                            rows={4}
                        />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex justify-end space-x-4 pt-6">
                <Button variant="outline" onClick={onPrev} className="text-gray-600">
                    Previous
                </Button>
                <Button onClick={handleNext}>
                    Next
                </Button>
            </div>
        </div>
    )
}
