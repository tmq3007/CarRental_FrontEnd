"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, X, ChevronDown, ChevronUp, Search, RotateCw, MapPin, Clock, MoreHorizontal } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface FilterTag {
  id: string
  label: string
  type: string
  value: any
  priority?: number
  isEmpty?: boolean
}

interface ResponsiveFilterPillProps {
  isExpanded: boolean
  onToggleExpanded: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
  filterTags: FilterTag[]
  onRemoveTag: (type: string, value: any) => void
  onClearAll: () => void
  activeFiltersCount: number
  location: {
    province: string
    district: string
    ward: string
  }
  pickupTime: Date | null
  dropoffTime: Date | null
}

export default function ResponsiveFilterPill({
  isExpanded,
  onToggleExpanded,
  searchQuery,
  onSearchChange,
  filterTags,
  onRemoveTag,
  onClearAll,
  activeFiltersCount,
  location,
  pickupTime,
  dropoffTime,
}: ResponsiveFilterPillProps) {
  const [isOverflowing, setIsOverflowing] = useState(false)
  const [showAllTags, setShowAllTags] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  // Format date to readable string
  const formatDate = (date: Date | null) => {
    if (!date) return "Select date & time"
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    })
  }

  // Create location string
  const locationString = location.province
    ? `${location.province}${location.district ? `, ${location.district}` : ""}${location.ward ? `, ${location.ward}` : ""}`
    : "Select location"

  // Create priority tags
  const priorityTags = [
    {
      id: "location",
      label: locationString === "Select location" ? "Location" : locationString,
      type: "location",
      value: location,
      priority: 3,
      icon: <MapPin size={12} className="mr-1" />,
      isEmpty: locationString === "Select location",
    },
    {
      id: "pickup-time",
      label: formatDate(pickupTime),
      type: "pickupTime",
      value: pickupTime,
      priority: 2,
      icon: <Clock size={12} className="mr-1" />,
      isEmpty: !pickupTime,
    },
    {
      id: "dropoff-time",
      label: formatDate(dropoffTime),
      type: "dropoffTime",
      value: dropoffTime,
      priority: 1,
      icon: <Clock size={12} className="mr-1" />,
      isEmpty: !dropoffTime,
    },
  ]

  // Additional filter tags
  const additionalTags = filterTags.filter((tag) => !["location", "pickupTime", "dropoffTime"].includes(tag.type))

  // All tags combined
  const allTags = [...priorityTags, ...additionalTags]

  // Check if content is overflowing
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && tagsRef.current) {
        const containerWidth = containerRef.current.offsetWidth
        const tagsWidth = tagsRef.current.scrollWidth
        setIsOverflowing(tagsWidth > containerWidth)
      }
    }

    checkOverflow()
    window.addEventListener("resize", checkOverflow)
    return () => window.removeEventListener("resize", checkOverflow)
  }, [allTags, searchQuery])

  // Calculate dynamic width based on content
  const calculateDynamicWidth = () => {
    const baseWidth = 500
    const maxWidth = Math.min(window.innerWidth * 0.95, 1400)

    // Estimate content width
    const filterLabelWidth = 100
    const searchWidth = 150
    const chevronWidth = 40
    const padding = 40

    // Estimate tags width
    const tagsWidth = allTags.reduce((total, tag) => {
      if (
        tag.isEmpty &&
        priorityTags.some(priorityTag => priorityTag.id === tag.id)
      ) {
        return total + Math.min(tag.label.length * 7 + 50, 150)
      }
      return total + Math.min(tag.label.length * 7 + 60, 180)
    }, 0)

    const estimatedWidth = filterLabelWidth + searchWidth + tagsWidth + chevronWidth + padding

    return Math.max(baseWidth, Math.min(maxWidth, estimatedWidth))
  }

  const dynamicWidth = calculateDynamicWidth()

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-col items-center">
        {/* Main Filter Pill */}
        <div
          ref={containerRef}
          className="flex items-center bg-background border-2 border-border rounded-full shadow-lg px-4 py-2 h-14 cursor-pointer hover:shadow-xl transition-all duration-300"
          style={{
            width: `${dynamicWidth}px`,
            minWidth: "500px",
            maxWidth: "95vw",
          }}
          onClick={onToggleExpanded}
        >
          {/* Filter Label */}
          <div className="flex items-center gap-2 mr-3 flex-shrink-0">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filter</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>

          {/* Search Input */}
          <div className="relative w-[150px] mr-3 flex-shrink-0">
            <input
              type="text"
              placeholder="Search cars..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-sm border-0 bg-transparent focus:outline-none placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
          </div>

          {/* Tags Container */}
          <div
            ref={tagsRef}
            className={`flex-1 flex items-center gap-2 py-1 transition-all duration-300 ${
              showAllTags ? "flex-wrap" : "overflow-hidden"
            }`}
            style={{ minWidth: 0 }}
          >
            {/* Priority Tags - Always Visible */}
            {priorityTags.map((tag) => (
              <Badge
                key={tag.id}
                variant={tag.isEmpty ? "outline" : "secondary"}
                className={`px-2 py-1 text-xs whitespace-nowrap flex items-center gap-1 flex-shrink-0 ${
                  tag.isEmpty ? "text-muted-foreground" : "bg-muted/50 hover:bg-muted"
                }`}
              >
                {tag.icon}
                <span className="truncate" style={{ maxWidth: tag.isEmpty ? "120px" : "150px" }}>
                  {tag.label}
                </span>
                {!tag.isEmpty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveTag(tag.type, tag.value)
                    }}
                    className="text-muted-foreground hover:text-destructive transition-colors ml-1 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </Badge>
            ))}

            {/* Additional Filter Tags */}
            {additionalTags.map((tag, index) => (
              <Badge
                key={tag.id}
                variant="outline"
                className={`px-2 py-1 text-xs whitespace-nowrap flex items-center gap-1 bg-muted/50 hover:bg-muted flex-shrink-0 ${
                  !showAllTags && isOverflowing && index >= 2 ? "hidden" : ""
                }`}
              >
                <span className="truncate max-w-[120px]">{tag.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveTag(tag.type, tag.value)
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}

            {/* Overflow Indicator */}
            {!showAllTags && isOverflowing && additionalTags.length > 2 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowAllTags(true)
                }}
                className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
              >
                <MoreHorizontal className="w-3 h-3" />
                <span>+{additionalTags.length - 2}</span>
              </button>
            )}

            {/* Show "No additional filters" if only priority tags exist and they're empty */}
            {additionalTags.length === 0 && priorityTags.every((tag) => tag.isEmpty) && (
              <span className="text-muted-foreground text-sm">No filters selected</span>
            )}
          </div>

          {/* Collapse button when showing all tags */}
          {showAllTags && isOverflowing && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowAllTags(false)
              }}
              className="ml-2 p-1 text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
          )}

          {/* Dropdown Indicator */}
          <div className="ml-2 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Expanded Tags Row - Shows when pill is overflowing and showAllTags is true */}
        {showAllTags && isOverflowing && additionalTags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2 max-w-[95vw] justify-center">
            {additionalTags.slice(2).map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="px-2 py-1 text-xs whitespace-nowrap flex items-center gap-1 bg-muted/50 hover:bg-muted"
              >
                <span className="truncate max-w-[120px]">{tag.label}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemoveTag(tag.type, tag.value)
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Clear All Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="mt-2 text-xs text-muted-foreground hover:text-destructive"
          >
            <RotateCw className="w-3 h-3 mr-1" />
            Clear all
          </Button>
        )}
      </div>
    </div>
  )
}
