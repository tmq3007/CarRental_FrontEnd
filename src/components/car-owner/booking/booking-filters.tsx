'use client'

import { format } from 'date-fns'
import {
  ArrowUpDown,
  Calendar as CalendarIcon,
  Filter,
  Loader2,
  RefreshCw,
  Search as SearchIcon,
  X,
} from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { STATUS_OPTIONS } from '@/components/car-owner/booking/status-badge'
import type { CarOwnerBookingQueryParams } from '@/lib/services/booking-api'

export type BookingSortKey = NonNullable<CarOwnerBookingQueryParams['sortBy']>
export type BookingSortDirection = NonNullable<CarOwnerBookingQueryParams['sortDirection']>

export interface BookingSortOption {
  id: string
  label: string
  sortBy: BookingSortKey
  sortDirection: BookingSortDirection
  description?: string
}

interface BookingFiltersProps {
  searchValue: string
  onSearchChange: (value: string) => void
  carNameValue: string
  onCarNameChange: (value: string) => void
  selectedStatuses: string[]
  onStatusesChange: (values: string[]) => void
  dateRange?: DateRange
  onDateRangeChange: (value: DateRange | undefined) => void
  sortOptions: BookingSortOption[]
  activeSortId: string
  onSortSelect: (optionId: string) => void
  onResetFilters: () => void
  pageSize: number
  onPageSizeChange: (size: number) => void
  isFetching?: boolean
  onRefresh?: () => void
}

function formatRangeLabel(range?: DateRange) {
  if (!range?.from && !range?.to) {
    return 'Date range'
  }
  if (range.from && range.to) {
    return `${format(range.from, 'MMM d, yyyy')} - ${format(range.to, 'MMM d, yyyy')}`
  }
  if (range.from) {
    return `From ${format(range.from, 'MMM d, yyyy')}`
  }
  if (range.to) {
    return `Until ${format(range.to, 'MMM d, yyyy')}`
  }
  return 'Date range'
}

export function BookingFilters({
  searchValue,
  onSearchChange,
  carNameValue,
  onCarNameChange,
  selectedStatuses,
  onStatusesChange,
  dateRange,
  onDateRangeChange,
  sortOptions,
  activeSortId,
  onSortSelect,
  onResetFilters,
  pageSize,
  onPageSizeChange,
  isFetching,
  onRefresh,
}: BookingFiltersProps) {
  const activeSort = sortOptions.find((option) => option.id === activeSortId) ?? sortOptions[0]
  const appliedStatusesLabel = (() => {
    if (selectedStatuses.length === 0) return 'None'
    if (selectedStatuses.length === STATUS_OPTIONS.length) return 'All'
    if (selectedStatuses.length <= 2) {
      return selectedStatuses
        .map((status) => STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status)
        .join(', ')
    }
    return `${selectedStatuses.length} selected`
  })()

  const handleStatusToggle = (status: string, checked: boolean) => {
    if (checked && !selectedStatuses.includes(status)) {
      onStatusesChange([...selectedStatuses, status])
      return
    }
    if (!checked) {
      onStatusesChange(selectedStatuses.filter((item) => item !== status))
    }
  }

  const handlePageSizeChange = (value: string) => {
    const numericValue = Number(value)
    if (!Number.isNaN(numericValue)) {
      onPageSizeChange(numericValue)
    }
  }

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Bookings management</h1>
          <p className="text-sm text-slate-500">Review, filter, and action bookings across your fleet.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onResetFilters} className="gap-2 text-slate-600">
            <X className="h-4 w-4" />
            Reset
          </Button>
          {onRefresh && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="gap-2"
            >
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Refresh
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search by renter, booking number, or email"
            className="h-11 rounded-xl border-slate-200 pl-10 focus-visible:ring-2 focus-visible:ring-emerald-500"
          />
        </div>

        <Input
          value={carNameValue}
          onChange={(event) => onCarNameChange(event.target.value)}
          placeholder="Filter by car name"
          className="h-11 rounded-xl border-slate-200 focus-visible:ring-2 focus-visible:ring-emerald-500"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-11 justify-start gap-2 rounded-xl border-slate-200 text-left">
              <Filter className="h-4 w-4 text-emerald-500" />
              <span className="truncate">Status: {appliedStatusesLabel}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Booking status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {STATUS_OPTIONS.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={selectedStatuses.includes(option.value)}
                onCheckedChange={(checked) => handleStatusToggle(option.value, Boolean(checked))}
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onStatusesChange(STATUS_OPTIONS.map((option) => option.value))}>
              Select all
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusesChange([])}>Clear</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="h-11 justify-start gap-2 rounded-xl border-slate-200 text-left"
            >
              <CalendarIcon className="h-4 w-4 text-emerald-500" />
              <span className="truncate">{formatRangeLabel(dateRange)}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              numberOfMonths={2}
              selected={dateRange}
              onSelect={onDateRangeChange}
            />
            <div className="flex items-center justify-between border-t border-slate-200 px-4 py-3">
              <span className="text-xs text-slate-500">Pick-up and return dates</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-xs"
                onClick={() => onDateRangeChange(undefined)}
              >
                Clear
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2 rounded-xl border-slate-200">
                <ArrowUpDown className="h-4 w-4 text-emerald-500" />
                <span className="truncate">Sort: {activeSort?.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60">
              <DropdownMenuLabel>Sort bookings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option) => (
                <DropdownMenuItem key={option.id} onClick={() => onSortSelect(option.id)} className="flex-col items-start gap-1">
                  <span className="text-sm font-medium text-slate-900">{option.label}</span>
                  {option.description && <span className="text-xs text-slate-500">{option.description}</span>}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">Rows per page</span>
          <Select value={String(pageSize)} onValueChange={handlePageSizeChange}>
            <SelectTrigger className="h-10 w-[90px] rounded-xl border-slate-200">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
