import { Card, CardContent } from "@/components/ui/card"

interface CarSpecs {
    licensePlate?: string
    brandName?: string
    productionYear?: string
    transmission?: string
    color?: string
    model?: string
    numberOfSeats?: string
    fuel?: string
}

interface Document {
    no: number
    name: string
    note: string
}

interface BasicInformationTabProps {
    specs: CarSpecs
    documents: Document[]
}

export function BasicInformationTab({ specs, documents }: BasicInformationTabProps) {
    return (
        <Card>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">License plate:</span>
                            <span className="text-sm">{specs.licensePlate || ""}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Brand name:</span>
                            <span className="text-sm">{specs.brandName || ""}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Production year:</span>
                            <span className="text-sm">{specs.productionYear || ""}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Transmission:</span>
                            <span className="text-sm">{specs.transmission || ""}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Color:</span>
                            <span className="text-sm">{specs.color || ""}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Model:</span>
                            <span className="text-sm">{specs.model || ""}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">No. of seats:</span>
                            <span className="text-sm">{specs.numberOfSeats || ""}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Fuel:</span>
                            <span className="text-sm">{specs.fuel || ""}</span>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Documents:</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse border border-gray-300">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">No</th>
                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Name</th>
                                <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Note</th>
                            </tr>
                            </thead>
                            <tbody>
                            {documents.map((doc) => (
                                <tr key={doc.no}>
                                    <td className="border border-gray-300 px-4 py-2 text-sm">{doc.no}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm">{doc.name}</td>
                                    <td className="border border-gray-300 px-4 py-2 text-sm">{doc.note}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        Note: Documents will be available for viewing after you've paid the deposit to rent.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
