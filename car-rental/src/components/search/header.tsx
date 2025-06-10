"use client"

import { useState } from "react"
import { DateTimePicker } from "../common/date-time-picker"
import AddressInput from "../common/address-input"

interface HeaderProps {
  location: string
  setLocation: (location: string) => void
  pickupDate: Date
  setPickupDate: (date: Date) => void
  dropoffDate: Date
  setDropoffDate: (date: Date) => void
  pickupTime: string
  setPickupTime: (time: string) => void
  dropoffTime: string
  setDropoffTime: (time: string) => void
}

export default function Header({
  location,
  setLocation,
  pickupDate,
  setPickupDate,
  dropoffDate,
  setDropoffDate,
  pickupTime,
  setPickupTime,
  dropoffTime,
  setDropoffTime,
}: HeaderProps) {
  const [showLocationSearch, setShowLocationSearch] = useState(false)

  return (
    <div className="lg:sticky lg:top-0 z-50 bg-white shadow-sm">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col gap-4">
            {/* Location and Date/Time Fields */}
            <div className="flex flex-col gap-3">
              {/* Location - Full width on mobile */}
              <AddressInput onLocationChange={() => { }} orientation="horizontal" />


              {/* Date/Time Fields - 2x2 grid on mobile, row on desktop */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                {/* Pickup Date */}
                <DateTimePicker label="Pickup Time" onChange={() => { }} />


                <DateTimePicker label="Dropoff Time" onChange={() => { }} />

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
