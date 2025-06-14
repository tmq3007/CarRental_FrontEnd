"use client"

import { Car, CircleDollarSign, Fuel, Gauge, MapPin, Clock } from "lucide-react"

interface FilterTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function FilterTabs({ activeTab, onTabChange }: FilterTabsProps) {
  const filterTabs = [
    { id: "location-time", icon: <Clock size={16} />, label: "Location & Time" },
    { id: "vehicle-type", icon: <Car size={16} />, label: "Vehicle" },
    { id: "price", icon: <CircleDollarSign size={16} />, label: "Price" },
    { id: "fuel", icon: <Fuel size={16} />, label: "Fuel" },
    { id: "transmission", icon: <Gauge size={16} />, label: "Transmission" },
  ]

  return (
    <div className="border-b border-gray-200">
      <div className="flex space-x-1 p-2 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            className={`flex items-center space-x-2 text-sm font-medium px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
