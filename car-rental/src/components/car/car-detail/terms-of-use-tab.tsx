import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PricingInfo {
    basePrice: string
    requiredDeposit: string
}

interface Term {
    id: string
    label: string
    checked: boolean
}

interface TermsOfUseTabProps {
    pricing: PricingInfo
    terms?: Term[]
}

export function TermsOfUseTab({ pricing, terms = [] }: TermsOfUseTabProps) {
    const defaultTerms: Term[] = [
        { id: "no-smoking", label: "No smoking", checked: true },
        { id: "no-pet", label: "No pet", checked: true },
        { id: "no-food", label: "No food in car", checked: false },
        { id: "other", label: "Other", checked: false },
    ]

    const termsToShow = terms.length > 0 ? terms : defaultTerms

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="base-price" className="text-sm text-gray-600">
                                Base price:
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input id="base-price" defaultValue={pricing.basePrice} className="w-24 text-right text-sm" disabled />
                                <span className="text-sm text-gray-600">VND/Day</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <Label htmlFor="deposit" className="text-sm text-gray-600">
                                Required deposit:
                            </Label>
                            <div className="flex items-center space-x-2">
                                <Input
                                    id="deposit"
                                    defaultValue={pricing.requiredDeposit}
                                    className="w-32 text-right text-sm"
                                    disabled
                                />
                                <span className="text-sm text-gray-600">VND</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-sm text-gray-600 font-medium mb-4">Terms of use</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            {termsToShow.slice(0, 2).map((term) => (
                                <div key={term.id} className="flex items-center space-x-2">
                                    <Checkbox id={term.id} checked={term.checked} disabled />
                                    <Label htmlFor={term.id} className="text-sm">
                                        {term.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <div className="space-y-3">
                            {termsToShow.slice(2).map((term) => (
                                <div key={term.id} className="flex items-center space-x-2">
                                    <Checkbox id={term.id} checked={term.checked} disabled />
                                    <Label htmlFor={term.id} className="text-sm">
                                        {term.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
