import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {BookingDetailVO} from "@/lib/services/booking-api";

interface CarInformationProps {
    bookingDetail: BookingDetailVO
}

export default function CarInformation({ bookingDetail }: CarInformationProps) {
    const documents = [
        {
            id: 1,
            name: "Insurance",
            note: bookingDetail.insuranceUriIsVerified ? "Verified" : "Not verified",
            link: bookingDetail.insuranceUri
        },
        {
            id: 2,
            name: "Registration Paper",
            note: bookingDetail.registrationPaperUriIsVerified ? "Verified" : "Not verified",
            link: bookingDetail.registrationPaperUri
        },
        {
            id: 3,
            name: "Certificate of Inspection",
            note: bookingDetail.certificateOfInspectionUriIsVerified ? "Verified" : "Not verified",
            link: bookingDetail.certificateOfInspectionUri
        }
    ]

    const features = [
        { id: "isAutomatic", name: "Automatic Transmission", available: bookingDetail.isAutomatic },
        { id: "isGasoline", name: "Gasoline Engine", available: bookingDetail.isGasoline },
    ]

    return (
        <div className="border rounded-md p-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex">
                        <div className="w-1/2 font-medium">License plate:</div>
                        <div className="w-1/2">{bookingDetail.licensePlate || "N/A"}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Brand name:</div>
                        <div className="w-1/2">{bookingDetail.brand}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Production year:</div>
                        <div className="w-1/2">{bookingDetail.productionYear}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Transmission:</div>
                        <div className="w-1/2">{bookingDetail.isAutomatic ? "Automatic" : "Manual"}</div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex">
                        <div className="w-1/2 font-medium">Color:</div>
                        <div className="w-1/2">{bookingDetail.color}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Model:</div>
                        <div className="w-1/2">{bookingDetail.model}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">No. of seats:</div>
                        <div className="w-1/2">{bookingDetail.numberOfSeats}</div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Fuel type:</div>
                        <div className="w-1/2">{bookingDetail.isGasoline ? "Gasoline" : "Diesel"}</div>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <h3 className="font-medium mb-2">Documents:</h3>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">No.</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Note</TableHead>
                            <TableHead>Link</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {documents.map((doc) => (
                            <TableRow key={doc.id}>
                                <TableCell>{doc.id}</TableCell>
                                <TableCell>{doc.name}</TableCell>
                                <TableCell>{doc.note}</TableCell>
                                <TableCell>
                                    {doc.link ? (
                                        <a href={doc.link} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                                            View Document
                                        </a>
                                    ) : (
                                        "Not available"
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex">
                    <div className="w-1/4 font-medium">Mileage:</div>
                    <div className="w-3/4">{bookingDetail.mileage} km</div>
                </div>
                <div className="flex">
                    <div className="w-1/4 font-medium">Fuel consumption:</div>
                    <div className="w-3/4">{bookingDetail.fuelConsumption} liter/100 km</div>
                </div>
                <div className="flex">
                    <div className="w-1/4 font-medium">Address:</div>
                    <div className="w-3/4">{bookingDetail.carAddress}</div>
                </div>
            </div>

            <div className="mt-6">
                <div className="font-medium mb-2">Description:</div>
                <p className="text-gray-600">
                    {bookingDetail.description || "No description provided"}
                </p>
            </div>

            <div className="mt-6">
                <div className="font-medium mb-2">Additional functions:</div>
                <p className="text-gray-600">
                    {bookingDetail.additionalFunction || "No additional functions specified"}
                </p>
            </div>

            <div className="mt-6">
                <div className="font-medium mb-2">Car Features:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {features.map((feature) => (
                        <div key={feature.id} className="flex items-center space-x-2">
                            <Checkbox id={feature.id} checked={feature.available} disabled />
                            <Label htmlFor={feature.id}>{feature.name}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6">
                <div className="font-medium mb-2">Terms of use:</div>
                <p className="text-gray-600">
                    {bookingDetail.termOfUse || "No specific terms provided"}
                </p>
            </div>
        </div>
    )
}