"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"
import {BookingDetailVO} from "@/lib/services/booking-api";

interface BookingInformationProps {
    bookingDetail: BookingDetailVO
}

export default function BookingInformation({ bookingDetail }: BookingInformationProps) {
    const [renterDob, setRenterDob] = useState<Date | undefined>(
        bookingDetail.renterDob ? new Date(bookingDetail.renterDob) : undefined
    )
    const [driverDob, setDriverDob] = useState<Date | undefined>(
        bookingDetail.driverDob ? new Date(bookingDetail.driverDob) : undefined
    )
    const [sameAsRenter, setSameAsRenter] = useState(false)

    const handleRenterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        // In a real app, you would update the state here
    }

    const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        // In a real app, you would update the state here
    }

    return (
        <div className="border rounded-md p-6 mt-4">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Renter&apos;s Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name*</Label>
                            <Input
                                id="renterFullName"
                                value={bookingDetail.renterFullName || ""}
                                onChange={handleRenterChange}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of birth*</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        {renterDob ? format(renterDob, "P") : "N/A"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={renterDob} onSelect={setRenterDob} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone number*</Label>
                            <Input
                                id="renterPhoneNumber"
                                value={bookingDetail.renterPhoneNumber || ""}
                                onChange={handleRenterChange}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address*</Label>
                            <Input
                                id="renterEmail"
                                type="email"
                                value={bookingDetail.renterEmail || ""}
                                onChange={handleRenterChange}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nationalId">National ID No.*</Label>
                            <Input
                                id="renterNationalId"
                                value={bookingDetail.renterNationalId || ""}
                                onChange={handleRenterChange}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="license">Driving license*</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="renterDrivingLicenseUri"
                                    className="flex-1"
                                    value={bookingDetail.renterDrivingLicenseUri ? "Uploaded" : "Not provided"}
                                    readOnly
                                />
                                {bookingDetail.renterDrivingLicenseUri && (
                                    <Button
                                        variant="outline"
                                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                        asChild
                                    >
                                        <a href={bookingDetail.renterDrivingLicenseUri} target="_blank" rel="noopener noreferrer">
                                            View
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address*</Label>
                            <Input
                                id="renterHouseNumberStreet"
                                value={`${bookingDetail.renterHouseNumberStreet || ""}, ${bookingDetail.renterWard || ""}, ${bookingDetail.renterDistrict || ""}, ${bookingDetail.renterCityProvince || ""}`}
                                readOnly
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-4">Driver&apos;s Information</h3>
                    <div className="mb-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="same-as-renter"
                                checked={sameAsRenter}
                                onCheckedChange={(checked) => {
                                    setSameAsRenter(checked as boolean)
                                }}
                            />
                            <label
                                htmlFor="same-as-renter"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Same as renter&apos;s information
                            </label>
                        </div>
                    </div>

                    {!sameAsRenter && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="driver-fullName">Full Name*</Label>
                                <Input
                                    id="driverFullName"
                                    value={bookingDetail.driverFullName || ""}
                                    onChange={handleDriverChange}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-dob">Date of birth*</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            {driverDob ? format(driverDob, "P") : "N/A"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={driverDob} onSelect={setDriverDob} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-phone">Phone number*</Label>
                                <Input
                                    id="driverPhoneNumber"
                                    value={bookingDetail.driverPhoneNumber || ""}
                                    onChange={handleDriverChange}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-email">Email address*</Label>
                                <Input
                                    id="driverEmail"
                                    type="email"
                                    value={bookingDetail.driverEmail || ""}
                                    onChange={handleDriverChange}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-nationalId">National ID No.*</Label>
                                <Input
                                    id="driverNationalId"
                                    value={bookingDetail.driverNationalId || ""}
                                    onChange={handleDriverChange}
                                    readOnly
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-license">Driving license*</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="driverDrivingLicenseUri"
                                        className="flex-1"
                                        value={bookingDetail.driverDrivingLicenseUri ? "Uploaded" : "Not provided"}
                                        readOnly
                                    />
                                    {bookingDetail.driverDrivingLicenseUri && (
                                        <Button
                                            variant="outline"
                                            className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                            asChild
                                        >
                                            <a href={bookingDetail.driverDrivingLicenseUri} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="driver-address">Address*</Label>
                                <Input
                                    id="driverHouseNumberStreet"
                                    value={`${bookingDetail.driverHouseNumberStreet || ""}, ${bookingDetail.driverWard || ""}, ${bookingDetail.driverDistrict || ""}, ${bookingDetail.driverCityProvince || ""}`}
                                    readOnly
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}