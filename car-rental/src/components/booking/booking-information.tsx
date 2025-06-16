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

export default function BookingInformation() {
    const [renterDob, setRenterDob] = useState<Date>()
    const [driverDob, setDriverDob] = useState<Date>()
    const [sameAsRenter, setSameAsRenter] = useState(false)

    return (
        <div className="border rounded-md p-6 mt-4">
            <div className="space-y-6">
                <div>
                    <h3 className="text-lg font-medium mb-4">Renter&apos;s Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="renter-name">Full Name*</Label>
                            <Input id="renter-name" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-dob">Date of birth*</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                                        {renterDob ? format(renterDob, "P") : "Pick a date"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={renterDob} onSelect={setRenterDob} initialFocus />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-phone">Phone number*</Label>
                            <Input id="renter-phone" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-email">Email address*</Label>
                            <Input id="renter-email" type="email" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-id">National ID No.*</Label>
                            <Input id="renter-id" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-license">Driving license*</Label>
                            <div className="flex gap-2">
                                <Input id="renter-license" className="flex-1" />
                                <Button
                                    variant="outline"
                                    className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                >
                                    Upload
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="renter-address">Address*</Label>
                            <Input id="renter-address" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-city">City/Province*</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select city" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="hanoi">Hanoi</SelectItem>
                                    <SelectItem value="hcm">Ho Chi Minh City</SelectItem>
                                    <SelectItem value="danang">Da Nang</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-district">District*</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="district1">District 1</SelectItem>
                                    <SelectItem value="district2">District 2</SelectItem>
                                    <SelectItem value="district3">District 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-ward">Ward*</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select ward" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ward1">Ward 1</SelectItem>
                                    <SelectItem value="ward2">Ward 2</SelectItem>
                                    <SelectItem value="ward3">Ward 3</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="renter-street">Street/House No.*</Label>
                            <Input id="renter-street" />
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
                                onCheckedChange={(checked) => setSameAsRenter(checked as boolean)}
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
                                <Label htmlFor="driver-name">Full Name*</Label>
                                <Input id="driver-name" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-dob">Date of birth*</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            {driverDob ? format(driverDob, "P") : "Pick a date"}
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
                                <Input id="driver-phone" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-email">Email address*</Label>
                                <Input id="driver-email" type="email" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-id">National ID No.*</Label>
                                <Input id="driver-id" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-license">Driving license*</Label>
                                <div className="flex gap-2">
                                    <Input id="driver-license" className="flex-1" />
                                    <Button
                                        variant="outline"
                                        className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                                    >
                                        Upload
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="driver-address">Address*</Label>
                                <Input id="driver-address" />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-city">City/Province*</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="hanoi">Hanoi</SelectItem>
                                        <SelectItem value="hcm">Ho Chi Minh City</SelectItem>
                                        <SelectItem value="danang">Da Nang</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-district">District*</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select district" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="district1">District 1</SelectItem>
                                        <SelectItem value="district2">District 2</SelectItem>
                                        <SelectItem value="district3">District 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-ward">Ward*</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select ward" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ward1">Ward 1</SelectItem>
                                        <SelectItem value="ward2">Ward 2</SelectItem>
                                        <SelectItem value="ward3">Ward 3</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-street">Street/House No.*</Label>
                                <Input id="driver-street" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button variant="outline">Discard</Button>
                    <Button>Save</Button>
                </div>
            </div>
        </div>
    )
}
