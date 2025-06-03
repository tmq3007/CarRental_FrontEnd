import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Bluetooth, Navigation, Camera, Sun, Shield, Baby, Disc, Usb } from "lucide-react"

interface AdditionalFunction {
    icon: React.ComponentType<{ className?: string }>
    label: string
    checked: boolean
}

interface CarDetails {
    mileage?: string
    fuelConsumption?: string
    address?: string
    description?: string
}

interface DetailsTabProps {
    details: CarDetails
    additionalFunction?: string  // Changed from additionalFunctions array to optional string
}

export function DetailsTab({ details, additionalFunction }: DetailsTabProps) {
    // Default functions with all options unchecked
    const defaultFunctions: AdditionalFunction[] = [
        { icon: Bluetooth, label: "Bluetooth", checked: false },
        { icon: Navigation, label: "GPS", checked: false },
        { icon: Camera, label: "Camera", checked: false },
        { icon: Sun, label: "Sun roof", checked: false },
        { icon: Shield, label: "Child lock", checked: false },
        { icon: Baby, label: "Child seat", checked: false },
        { icon: Disc, label: "DVD", checked: false },
        { icon: Usb, label: "USB", checked: false },
    ]

    // Parse the additionalFunction string and update checked status
    const parseAdditionalFunctions = () => {
        if (!additionalFunction) return defaultFunctions;

        const activeFunctions = additionalFunction.split(',').map(f => f.trim());
        return defaultFunctions.map(func => ({
            ...func,
            checked: activeFunctions.includes(func.label)
        }));
    }

    const functions = parseAdditionalFunctions();

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <div>
                    <span className="text-sm text-gray-600">Mileage: {details.mileage || ""}</span>
                </div>

                <div>
          <span className="text-sm text-gray-600">
            Fuel consumption: {details.fuelConsumption || "18 liter/100 km"}
          </span>
                </div>

                <div>
                    <span className="text-sm text-gray-600">Address: {details.address || ""}</span>
                    <p className="text-xs text-gray-500 mt-1">
                        Note: Full address will be available after you've paid the deposit to rent.
                    </p>
                </div>

                <div>
                    <span className="text-sm text-gray-600 font-medium">Description:</span>
                    <p className="text-sm text-gray-700 mt-2">
                        {details.description ||
                            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
                    </p>
                </div>

                <div>
                    <h3 className="text-sm text-gray-600 font-medium mb-4">Additional functions:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {functions.map((func, index) => (
                            <div key={index} className="flex items-center space-x-2">
                                <func.icon className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-700">{func.label}</span>
                                <Checkbox checked={func.checked} disabled />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
