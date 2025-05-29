"use client"

import type React from "react"

import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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
      // If we have an existing time, preserve it
      if (value) {
        const newDate = new Date(date)
        newDate.setHours(value.getHours())
        newDate.setMinutes(value.getMinutes())
        onChange(newDate)
      } else {
        // Set default time to 10:00 AM
        const newDate = new Date(date)
        newDate.setHours(10, 0, 0, 0)
        onChange(newDate)
      }
    }
  }

  function handleTimeChange(type: "hour" | "minute" | "ampm", timeValue: string) {
    const currentDate = value || new Date()
    const newDate = new Date(currentDate)

    if (type === "hour") {
      const hour = Number.parseInt(timeValue, 10)
      const currentHours = newDate.getHours()
      const isPM = currentHours >= 12

      if (isPM) {
        newDate.setHours(hour === 12 ? 12 : hour + 12)
      } else {
        newDate.setHours(hour === 12 ? 0 : hour)
      }
    } else if (type === "minute") {
      newDate.setMinutes(Number.parseInt(timeValue, 10))
    } else if (type === "ampm") {
      const hours = newDate.getHours()
      if (timeValue === "AM" && hours >= 12) {
        newDate.setHours(hours - 12)
      } else if (timeValue === "PM" && hours < 12) {
        newDate.setHours(hours + 12)
      }
    }

    onChange(newDate)
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
        <PopoverContent className="w-auto p-0">
          <div className="sm:flex">
            <Calendar mode="single" selected={value} onSelect={handleDateSelect} initialFocus />
            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i + 1)
                    .reverse()
                    .map((hour) => (
                      <Button
                        key={hour}
                        size="icon"
                        variant={value && value.getHours() % 12 === hour % 12 ? "default" : "ghost"}
                        className="sm:w-full shrink-0 aspect-square"
                        onClick={() => handleTimeChange("hour", hour.toString())}
                      >
                        {hour}
                      </Button>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex sm:flex-col p-2">
                  {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                    <Button
                      key={minute}
                      size="icon"
                      variant={value && value.getMinutes() === minute ? "default" : "ghost"}
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("minute", minute.toString())}
                    >
                      {minute.toString().padStart(2, "0")}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" className="sm:hidden" />
              </ScrollArea>
              <ScrollArea className="">
                <div className="flex sm:flex-col p-2">
                  {["AM", "PM"].map((ampm) => (
                    <Button
                      key={ampm}
                      size="icon"
                      variant={
                        value && ((ampm === "AM" && value.getHours() < 12) || (ampm === "PM" && value.getHours() >= 12))
                          ? "default"
                          : "ghost"
                      }
                      className="sm:w-full shrink-0 aspect-square"
                      onClick={() => handleTimeChange("ampm", ampm)}
                    >
                      {ampm}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
