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
import {useEffect, useState} from "react"
import {BookingDetailVO, BookingEditDTO, useUpdateBookingMutation} from "@/lib/services/booking-api";
import {AddressComponent} from "@/components/common/address-input-information";

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
    const [updateBooking, { isLoading }] = useUpdateBookingMutation()

    const [sameAsRenter, setSameAsRenter] = useState(bookingDetail.isRenterSameAsDriver)
    // State for editable driver information
    const [driverInfo, setDriverInfo] = useState({
        fullName: bookingDetail.driverFullName || "",
        phoneNumber: bookingDetail.driverPhoneNumber || "",
        email: bookingDetail.driverEmail || "",
        nationalId: bookingDetail.driverNationalId || "",
        houseNumberStreet: bookingDetail.driverHouseNumberStreet || "",
        ward: bookingDetail.driverWard || "",
        district: bookingDetail.driverDistrict || "",
        cityProvince: bookingDetail.driverCityProvince || "",
    })
    // Original driver info for comparison
    const [originalDriverInfo, setOriginalDriverInfo] = useState(driverInfo)
    const [hasChanges, setHasChanges] = useState(false)

    // Check for changes whenever driverInfo or driverDob changes
    useEffect(() => {
        const dobChanged = driverDob?.getTime() !== (bookingDetail.driverDob ? new Date(bookingDetail.driverDob).getTime() : undefined)
        const infoChanged = JSON.stringify(driverInfo) !== JSON.stringify(originalDriverInfo)
        setHasChanges(dobChanged || infoChanged)
    }, [driverInfo, driverDob, originalDriverInfo, bookingDetail.driverDob])

    const handleDriverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setDriverInfo(prev => ({
            ...prev,
            [id]: value
        }))
    }

    // const handleSave = () => {
    //     // Here you would typically send the updated data to your API
    //     console.log("Saving changes:", {
    //         ...driverInfo,
    //         dob: driverDob
    //     })
    //
    //     // Update original data to reflect the saved state
    //     setOriginalDriverInfo(driverInfo)
    //     setHasChanges(false)
    //
    //     // You might want to show a success message here
    // }

    const handleSave = async () => {
        try {
            const updateData: BookingEditDTO = {
                driverFullName: driverInfo.fullName,
                driverDob: driverDob ? format(driverDob, 'yyyy-MM-dd') : undefined,
                driverPhoneNumber: driverInfo.phoneNumber,
                driverEmail: driverInfo.email,
                driverNationalId: driverInfo.nationalId,
                driverHouseNumberStreet: driverInfo.houseNumberStreet,
                driverWard: driverInfo.ward,
                driverDistrict: driverInfo.district,
                driverCityProvince: driverInfo.cityProvince,
                // Note: driverDrivingLicenseUri is not included as it's handled separately
            }

            await updateBooking({
                bookingNumber: bookingDetail.bookingNumber,
                bookingDto: updateData
            }).unwrap()

            // Update original data to reflect the saved state
            setOriginalDriverInfo(driverInfo)
            setHasChanges(false)
            setDriverDob(updateData.driverDob ? new Date(updateData.driverDob) : undefined)

            console.log("Driver Dob:", driverDob)
            console.log("Renter Dob:", bookingDetail.renterDob)

            const isSameAsRenterNow = (
                driverInfo.fullName === bookingDetail.renterFullName &&
                driverInfo.phoneNumber === bookingDetail.renterPhoneNumber &&
                driverInfo.email === bookingDetail.renterEmail &&
                driverInfo.nationalId === bookingDetail.renterNationalId &&
                driverInfo.houseNumberStreet === bookingDetail.renterHouseNumberStreet &&
                driverInfo.ward === bookingDetail.renterWard &&
                driverInfo.district === bookingDetail.renterDistrict &&
                driverInfo.cityProvince === bookingDetail.renterCityProvince &&
                (driverDob ? format(driverDob, 'yyyy-MM-dd') : undefined) ===
                (bookingDetail.renterDob ? format(new Date(bookingDetail.renterDob), 'yyyy-MM-dd') : undefined)
            )


            // Nếu giống thì tự động check "Same as renter"
            if (isSameAsRenterNow) {
                setSameAsRenter(true)
            }

            // You might want to show a success toast here
        } catch (error) {
            // Handle error (show error toast, etc.)
            console.error('Failed to update booking:', error)
        }
    }

    const handleSameAsRenterChange = (checked: boolean) => {
        setSameAsRenter(checked)

        if (checked) {
            // Đặt thông tin tài xế giống với người thuê
            setDriverInfo({
                fullName: bookingDetail.renterFullName || "",
                phoneNumber: bookingDetail.renterPhoneNumber || "",
                email: bookingDetail.renterEmail || "",
                nationalId: bookingDetail.renterNationalId || "",
                houseNumberStreet: bookingDetail.renterHouseNumberStreet || "",
                ward: bookingDetail.renterWard || "",
                district: bookingDetail.renterDistrict || "",
                cityProvince: bookingDetail.renterCityProvince || "",
            })
            setDriverDob(bookingDetail.renterDob ? new Date(bookingDetail.renterDob) : undefined)

            // Đánh dấu có thay đổi để người dùng có thể lưu
            setHasChanges(true)
        } else {
            // Khôi phục về thông tin tài xế gốc
            setDriverInfo(originalDriverInfo)
            setDriverDob(bookingDetail.driverDob ? new Date(bookingDetail.driverDob) : undefined)

            // Kiểm tra xem có thay đổi không
            const dobChanged = bookingDetail.driverDob ?
                new Date(bookingDetail.driverDob).getTime() !== driverDob?.getTime() :
                driverDob !== undefined
            const infoChanged = JSON.stringify(originalDriverInfo) !== JSON.stringify(driverInfo)
            setHasChanges(dobChanged || infoChanged)
        }
    }
    const handleDiscard = () => {
        // Reset to original values
        setDriverInfo(originalDriverInfo)
        setDriverDob(bookingDetail.driverDob ? new Date(bookingDetail.driverDob) : undefined)
        setHasChanges(false)
    }

    return (
        <div className="border rounded-md p-6 mt-4">
            <div className="space-y-6">
                {/* Renter's Information - Read Only */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Renter&apos;s Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name*</Label>
                            <Input
                                id="renterFullName"
                                value={bookingDetail.renterFullName || ""}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of birth*</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start text-left font-normal" aria-readonly={true}>
                                        {renterDob ? format(renterDob, "P") : "N/A"}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar mode="single" selected={renterDob} onSelect={setRenterDob} initialFocus disabled />
                                </PopoverContent>
                            </Popover>
                        </div>


                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone number*</Label>
                            <Input
                                id="renterPhoneNumber"
                                value={bookingDetail.renterPhoneNumber || ""}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email address*</Label>
                            <Input
                                id="renterEmail"
                                type="email"
                                value={bookingDetail.renterEmail || ""}
                                readOnly
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nationalId">National ID No.*</Label>
                            <Input
                                id="renterNationalId"
                                value={bookingDetail.renterNationalId || ""}
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

                {/* Driver's Information - Editable when not same as renter */}
                <div>
                    <h3 className="text-lg font-medium mb-4">Driver&apos;s Information</h3>
                    <div className="mb-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="same-as-renter"
                                checked={sameAsRenter}
                                onCheckedChange={handleSameAsRenterChange}
                                disabled={isLoading}
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
                                <Label htmlFor="driverFullName">Full Name*</Label>
                                <Input
                                    id="fullName"
                                    value={driverInfo.fullName}
                                    onChange={handleDriverChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driver-dob">Date of birth*</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            {driverDob ? format(driverDob, "P") : "Select date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={driverDob}
                                            onSelect={setDriverDob}
                                            initialFocus
                                            // fromYear={1900}
                                            // toYear={new Date().getFullYear() - 18}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>



                            <div className="space-y-2">
                                <Label htmlFor="driverPhoneNumber">Phone number*</Label>
                                <Input
                                    id="phoneNumber"
                                    value={driverInfo.phoneNumber}
                                    onChange={handleDriverChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driverEmail">Email address*</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={driverInfo.email}
                                    onChange={handleDriverChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driverNationalId">National ID No.*</Label>
                                <Input
                                    id="nationalId"
                                    value={driverInfo.nationalId}
                                    onChange={handleDriverChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="driverDrivingLicenseUri">Driving license*</Label>
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
                            <AddressComponent
                                mode="booking"
                                houseNumberStreet={driverInfo.houseNumberStreet}
                                cityProvince={driverInfo.cityProvince}
                                district={driverInfo.district}
                                ward={driverInfo.ward}
                                onHouseNumberStreetChange={(value) => setDriverInfo(prev => ({ ...prev, houseNumberStreet: value }))}
                                onCityProvinceChange={(value) => setDriverInfo(prev => ({ ...prev, cityProvince: value }))}
                                onDistrictChange={(value) => setDriverInfo(prev => ({ ...prev, district: value }))}
                                onWardChange={(value) => setDriverInfo(prev => ({ ...prev, ward: value }))}
                               // errors={errors}
                            />
                            {(hasChanges || sameAsRenter) && (
                                <div className="flex justify-center gap-2 mt-4">
                                    <Button
                                        variant="outline"
                                        onClick={handleDiscard}
                                        disabled={isLoading}
                                    >
                                        Discard
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="bg-blue-600 hover:bg-blue-700"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Save Changes"}
                                    </Button>
                                </div>
                            )}
                            {/*<div className="space-y-2">*/}
                            {/*    <Label htmlFor="driverHouseNumberStreet">House number & Street*</Label>*/}
                            {/*    <Input*/}
                            {/*        id="houseNumberStreet"*/}
                            {/*        value={driverInfo.houseNumberStreet}*/}
                            {/*        onChange={handleDriverChange}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/*<div className="space-y-2">*/}
                            {/*    <Label htmlFor="driverWard">Ward*</Label>*/}
                            {/*    <Input*/}
                            {/*        id="ward"*/}
                            {/*        value={driverInfo.ward}*/}
                            {/*        onChange={handleDriverChange}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/*<div className="space-y-2">*/}
                            {/*    <Label htmlFor="driverDistrict">District*</Label>*/}
                            {/*    <Input*/}
                            {/*        id="district"*/}
                            {/*        value={driverInfo.district}*/}
                            {/*        onChange={handleDriverChange}*/}
                            {/*    />*/}
                            {/*</div>*/}

                            {/*<div className="space-y-2">*/}
                            {/*    <Label htmlFor="driverCityProvince">City/Province*</Label>*/}
                            {/*    <Input*/}
                            {/*        id="cityProvince"*/}
                            {/*        value={driverInfo.cityProvince}*/}
                            {/*        onChange={handleDriverChange}*/}
                            {/*    />*/}
                            {/*</div>*/}

                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}