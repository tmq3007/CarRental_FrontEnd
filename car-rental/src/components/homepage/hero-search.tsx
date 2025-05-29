"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, MapPin, Clock, Search } from "lucide-react"
import Image from "next/image"
import { DateTimePicker } from "../common/date-time-picker"

interface SearchFormData {
  pickupLocation: string
  pickupDateTime: Date | undefined
  dropoffDateTime: Date | undefined
}

export default function HeroSearchSection() {
  const defaultDate = new Date(2025, 4, 29, 10, 0) // May 29, 2025, 10:00 AM

  const [searchData, setSearchData] = useState<SearchFormData>({
    pickupLocation: "",
    pickupDateTime: defaultDate,
    dropoffDateTime: defaultDate,
  })

  const handleSearch = () => {
    console.log("Search data:", searchData)
    // Handle search logic here
  }

  const handleLocationChange = (value: string) => {
    setSearchData((prev) => ({
      ...prev,
      pickupLocation: value,
    }))
  }

  const handlePickupDateTimeChange = (date: Date | undefined) => {
    setSearchData((prev) => ({
      ...prev,
      pickupDateTime: date,
    }))
  }

  const handleDropoffDateTimeChange = (date: Date | undefined) => {
    setSearchData((prev) => ({
      ...prev,
      dropoffDateTime: date,
    }))
  }

  return (
    <section className="relative pt-12 sm:pt-16 md:pt-20 px-4 sm:px-8 md:px-14 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image src="/picture/hero-background.jpg" alt="Mountain lake landscape" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto text-center w-full flex flex-col">

        {/* Hero Text */}
        <div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Where Every Journey
            <br className="hidden xs:block" />
            <span className="inline xs:hidden"> </span>
            Become An Adventure
          </h1>

          {/* Social Proof */}
          <div className="flex flex-col xs:flex-row items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs sm:text-sm font-semibold"
                >
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
            <div className="text-white mt-2 xs:mt-0">
              <span className="font-semibold text-sm sm:text-base">33k People Booked</span>
              <br />
              <span className="text-xs sm:text-sm opacity-90">Dream Place</span>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <Card className="max-w-7xl mx-auto p-4 sm:p-5 md:p-6 bg-white/95 backdrop-blur-sm shadow-2xl mb-8 sm:mb-12 md:mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 items-end">
            {/* Pickup Location */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Pickup Location
              </Label>
              <Select onValueChange={handleLocationChange}>
                <SelectTrigger className="h-12 bg-white hover:bg-green-50">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="california-city">California City</SelectItem>
                  <SelectItem value="los-angeles">Los Angeles</SelectItem>
                  <SelectItem value="san-francisco">San Francisco</SelectItem>
                  <SelectItem value="san-diego">San Diego</SelectItem>
                  <SelectItem value="sacramento">Sacramento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Pickup Date & Time */}
            <DateTimePicker
              value={searchData.pickupDateTime}
              onChange={handlePickupDateTimeChange}
              label="Pickup Date & Time"
              placeholder="Select pickup date & time"
              icon={<CalendarDays className="w-4 h-4" />}
            />

            {/* Drop-off Date & Time */}
            <DateTimePicker
              value={searchData.dropoffDateTime}
              onChange={handleDropoffDateTimeChange}
              label="Drop-off Date & Time"
              placeholder="Select drop-off date & time"
              icon={<Clock className="w-4 h-4" />}
            />
          </div>

          {/* Search Button */}
          <div className="mt-6 sm:mt-7 md:mt-8 flex justify-center">
            <Button
              onClick={handleSearch}
              className="bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3 h-12 text-base sm:text-lg font-semibold rounded-lg flex items-center gap-2 w-full xs:w-auto min-w-[140px]"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              Search Cars
            </Button>
          </div>
        </Card>
      </div>
    </section>
  )
}
