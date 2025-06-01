"use client"

import type * as React from "react"
import { CalendarIcon, Clock, Zap } from "lucide-react"
import { format, addDays, addWeeks, startOfWeek, addMonths } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { TimePickerInput } from "../ui/time-picker-input"

interface DateTimePickerProps {
  value?: Date
  onChange: (date: Date | undefined) => void
  label: string
  placeholder?: string
  icon?: React.ReactNode
}

export function DateTimePicker({
  value,
  onChange,
  label,
  placeholder = "Select date & time",
  icon,
}: DateTimePickerProps) {
  function handleDateSelect(date: Date | undefined) {
    if (date) {
      if (value) {
        const newDate = new Date(date)
        newDate.setHours(value.getHours())
        newDate.setMinutes(value.getMinutes())
        onChange(newDate)
      } else {
        const newDate = new Date(date)
        newDate.setHours(10, 0, 0, 0)
        onChange(newDate)
      }
    }
  }

  function quickSelect(offsetDays: number, hour = 10) {
    const date = new Date()
    date.setDate(date.getDate() + offsetDays)
    date.setHours(hour, 0, 0, 0)
    onChange(date)
  }

  function quickSelectSpecific(date: Date, hour = 10) {
    const newDate = new Date(date)
    newDate.setHours(hour, 0, 0, 0)
    onChange(newDate)
  }

  const quickOptions = [
    {
      label: "Today",
      sublabel: format(new Date(), "EEEE"),
      date: new Date(),
      icon: <Zap className="h-4 w-4" />,
      action: () => quickSelect(0),
    },
    {
      label: "Tomorrow",
      sublabel: format(addDays(new Date(), 1), "EEEE"),
      date: addDays(new Date(), 1),
      icon: <CalendarIcon className="h-4 w-4" />,
      action: () => quickSelect(1),
    },
    {
      label: "This Weekend",
      sublabel: "Saturday",
      date: addDays(startOfWeek(new Date()), 6),
      icon: <CalendarIcon className="h-4 w-4" />,
      action: () => quickSelectSpecific(addDays(startOfWeek(new Date()), 6)),
    },
    {
      label: "Next Week",
      sublabel: format(addWeeks(new Date(), 1), "MMM d"),
      date: addWeeks(new Date(), 1),
      icon: <CalendarIcon className="h-4 w-4" />,
      action: () => quickSelect(7),
    },
    {
      label: "Next Month",
      sublabel: format(addMonths(new Date(), 1), "MMM d"),
      date: addMonths(new Date(), 1),
      icon: <CalendarIcon className="h-4 w-4" />,
      action: () => quickSelectSpecific(addMonths(new Date(), 1)),
    },
  ]

  const timePresets = [
    { label: "Morning", time: "9:00 AM", hour: 9 },
    { label: "Afternoon", time: "2:00 PM", hour: 14 },
    { label: "Evening", time: "6:00 PM", hour: 18 },
  ]

  function handleTimeChange(type: string, newValue: string): void {
    if (!value) return;
    const newDate = new Date(value);

    if (type === "ampm") {
      const isPM = newValue === "PM";
      let hours = newDate.getHours();
      if (isPM && hours < 12) {
        newDate.setHours(hours + 12);
      } else if (!isPM && hours >= 12) {
        newDate.setHours(hours - 12);
      }
      onChange(newDate);
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("h-12 w-full justify-start text-left font-normal", !value && "text-muted-foreground")}
          >
            {value ? format(value, "MM/dd/yyyy hh:mm aa") : <span>{placeholder}</span>}
            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 shadow-lg border-gray-200" align="start">
          <div className="flex flex-col">
            {/* Top Section: Calendar and Quick Select */}
            <div className="flex flex-col sm:flex-row sm:items-start">
              <div className="p-1">
                <Calendar
                  mode="single"
                  selected={value}
                  onSelect={handleDateSelect}
                  autoFocus
                  className="rounded-lg"
                />
              </div>

              <div className="flex flex-col w-full sm:w-64 sm:border-l border-t sm:border-t-0">
                {/* Quick Date Selection */}
                <div className="py-2.5 px-3 space-y-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Zap className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium text-sm text-gray-900">Quick Select</h3>
                  </div>

                  <div className="space-y-1">
                    {quickOptions.map((option, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        className="h-auto py-1.5 px-2 justify-start hover:bg-green-50 hover:border-blue-200 border border-transparent w-full"
                        onClick={option.action}
                      >
                        <div className="flex items-center gap-1.5 w-full">
                          <div className="flex-shrink-0 text-green-600">{option.icon}</div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-sm text-gray-900">{option.label}</div>
                            <div className="text-xs text-gray-500">{option.sublabel}</div>
                          </div>
                          <div className="text-xs text-gray-400">{format(option.date, "MMM d")}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Bottom Section: Time Controls Spanning Full Width */}
            <div className="py-2.5 px-3">
              <div className="flex flex-col sm:flex-row gap-6">
                {/* Time Presets */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <h3 className="font-medium text-sm text-gray-900">Time Presets</h3>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {timePresets.map((preset, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="h-auto p-2 flex-col hover:bg-green-50 hover:border-green-200 text-xs"
                        onClick={() => {
                          if (value) {
                            const newDate = new Date(value)
                            newDate.setHours(preset.hour, 0, 0, 0)
                            onChange(newDate)
                          }
                        }}
                      >
                        <div className="font-medium text-gray-900">{preset.label}</div>
                        <div className="text-gray-500">{preset.time}</div>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Time */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    <h3 className="font-medium text-sm text-gray-900">Custom Time</h3>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <TimePickerInput
                      picker="12hours"
                      date={value}
                      setDate={onChange}
                      period={value ? (value.getHours() >= 12 ? "PM" : "AM") : "AM"}
                      onRightFocus={() => document.getElementById("minute")?.focus()}
                    />
                    <span className="text-gray-500 text-sm">:</span>
                    <TimePickerInput
                      picker="minutes"
                      date={value}
                      setDate={onChange}
                      id="minute"
                      onLeftFocus={() => document.getElementById("12hours")?.focus()}
                      onRightFocus={() => document.getElementById("ampm")?.focus()}
                    />
                    <select
                      value={value ? format(value, "aa") : "AM"}
                      onChange={(e) => handleTimeChange("ampm", e.target.value)}
                      className="h-8 border border-gray-300 rounded px-2 text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}