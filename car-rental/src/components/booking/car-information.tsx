import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CarInformation() {
    return (
        <div className="border rounded-md p-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="flex">
                        <div className="w-1/2 font-medium">License plate:</div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Brand name:</div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Production year:</div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Transmission:</div>
                        <div className="w-1/2"></div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex">
                        <div className="w-1/2 font-medium">Color:</div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Model:</div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">No. of seats:</div>
                        <div className="w-1/2"></div>
                    </div>
                    <div className="flex">
                        <div className="w-1/2 font-medium">Fuel:</div>
                        <div className="w-1/2"></div>
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
                        <TableRow>
                            <TableCell>1</TableCell>
                            <TableCell>Registration paper</TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>
                                <a href="#" className="text-blue-600 hover:underline">
                                    View PDF
                                </a>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>2</TableCell>
                            <TableCell>Certificate of inspection</TableCell>
                            <TableCell>Verified</TableCell>
                            <TableCell>
                                <a href="#" className="text-blue-600 hover:underline">
                                    View PDF
                                </a>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>3</TableCell>
                            <TableCell>Insurance</TableCell>
                            <TableCell>Not available</TableCell>
                            <TableCell>Not available</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex">
                    <div className="w-1/4 font-medium">Mileage:</div>
                    <div className="w-3/4"></div>
                </div>
                <div className="flex">
                    <div className="w-1/4 font-medium">Fuel consumption:</div>
                    <div className="w-3/4">18 liter/100 km</div>
                </div>
                <div className="flex">
                    <div className="w-1/4 font-medium">Address:</div>
                    <div className="w-3/4">128 Trung Kinh, Yen Hoa, Cau Giay, Hanoi</div>
                </div>
            </div>

            <div className="mt-6">
                <div className="font-medium mb-2">Description:</div>
                <p className="text-gray-600">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                    consequat.
                </p>
            </div>

            <div className="mt-6">
                <div className="font-medium mb-4">Additional functions:</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="bluetooth" />
                        <Label htmlFor="bluetooth">Bluetooth</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="gps" />
                        <Label htmlFor="gps">GPS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="camera" defaultChecked />
                        <Label htmlFor="camera">Camera</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="sunroof" />
                        <Label htmlFor="sunroof">Sun roof</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="childlock" defaultChecked />
                        <Label htmlFor="childlock">Child lock</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="childseat" defaultChecked />
                        <Label htmlFor="childseat">Child seat</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="dvd" />
                        <Label htmlFor="dvd">DVD</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="usb" />
                        <Label htmlFor="usb">USB</Label>
                    </div>
                </div>
            </div>

            <div className="mt-6">
                <div className="font-medium mb-4">Terms of use:</div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                        <Checkbox id="no-smoking" />
                        <Label htmlFor="no-smoking">No smoking</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="no-food" />
                        <Label htmlFor="no-food">No food in car</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="no-pet" />
                        <Label htmlFor="no-pet">No pet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Checkbox id="other" />
                        <Label htmlFor="other">Other</Label>
                    </div>
                </div>
            </div>
        </div>
    )
}
