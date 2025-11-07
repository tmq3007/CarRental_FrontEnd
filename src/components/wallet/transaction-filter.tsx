"use client"

import type React from "react"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TransactionFiltersProps {
    searchTerm: string
    fromDate: string
    toDate: string
    onSearchTermChange: (value: string) => void
    onFromDateChange: (value: string) => void
    onToDateChange: (value: string) => void
    onSearch: () => void
    onClear: () => void
    canClear: boolean
}

export function TransactionFilters({
                                       searchTerm,
                                       fromDate,
                                       toDate,
                                       onSearchTermChange,
                                       onFromDateChange,
                                       onToDateChange,
                                       onSearch,
                                       onClear,
                                       canClear,
                                   }: TransactionFiltersProps) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            onSearch()
        }
    }

    return (
        <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
                <Label htmlFor="from-date">From</Label>
                <div className="relative">
                    <Input
                        id="from-date"
                        type="date"
                        value={fromDate}
                        onChange={(e) => onFromDateChange(e.target.value)}
                        className="w-40"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Label htmlFor="to-date">To</Label>
                <div className="relative">
                    <Input
                        id="to-date"
                        type="date"
                        value={toDate}
                        onChange={(e) => onToDateChange(e.target.value)}
                        className="w-40"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 ml-auto">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => onSearchTermChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="pl-10 w-64"
                    />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={onSearch}>
                    Search
                </Button>
                <Button variant="outline" onClick={onClear} disabled={!canClear}>
                    Clear
                </Button>
            </div>
        </div>
    )
}
