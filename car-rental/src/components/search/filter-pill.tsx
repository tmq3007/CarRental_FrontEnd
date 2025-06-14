"use client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Filter, X, ChevronDown, ChevronUp, Search, RotateCw, MapPin, Clock } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface FilterTag {
  id: string
  label: string
  type: string
  value: any
  priority?: number // Higher priority tags will be shown first
}

interface FilterPillProps {
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

export default function FilterPill({
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
}: FilterPillProps) {
  const [pillWidth, setPillWidth] = useState(500) // Base width
  const [visibleTagsCount, setVisibleTagsCount] = useState(0)
  const tagsContainerRef = useRef<HTMLDivElement>(null)

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

  // Create priority tags that should always be shown if they have values
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

  // Combine priority tags with regular filter tags
  const allTags = [
    ...priorityTags,
    ...filterTags.filter((tag) => !["location", "pickupTime", "dropoffTime"].includes(tag.type)),
  ]

  // Calculate how many tags can fit and adjust pill width
  useEffect(() => {
    const baseWidth = 500 // Minimum width
    const maxWidth = Math.min(window.innerWidth * 0.9, 1200) // Max 90% of screen width or 1200px
    const searchWidth = 150 // Search input width
    const filterLabelWidth = 70 // Filter label width
    const chevronWidth = 30 // Chevron width
    const padding = 32 // Total horizontal padding

    // Calculate the width needed for priority tags (always visible)
    const priorityTagsWidth = priorityTags.reduce((total, tag) => {
      // Estimate tag width based on label length
      const labelWidth = tag.label.length * 8 + 40 // Rough estimation
      return total + labelWidth
    }, 0)

    // Calculate available space for additional tags
    const availableSpace = maxWidth - filterLabelWidth - searchWidth - chevronWidth - padding - priorityTagsWidth

    // Calculate how many additional tags can fit
    let additionalTagsWidth = 0
    let visibleAdditionalTags = 0
    const additionalTags = filterTags.filter((tag) => !["location", "pickupTime", "dropoffTime"].includes(tag.type))

    for (const tag of additionalTags) {
      const tagWidth = tag.label.length * 8 + 40 // Rough estimation
      if (additionalTagsWidth + tagWidth <= availableSpace) {
        additionalTagsWidth += tagWidth
        visibleAdditionalTags++
      } else {
        break
      }
    }

    // If there are more tags than can fit, add space for "+X more" badge
    const hasMoreTags = additionalTags.length > visibleAdditionalTags
    const moreTagsWidth = hasMoreTags ? 60 : 0

    // Calculate final width
    const calculatedWidth = Math.max(
      baseWidth,
      Math.min(
        maxWidth,
        filterLabelWidth +
          searchWidth +
          priorityTagsWidth +
          additionalTagsWidth +
          moreTagsWidth +
          chevronWidth +
          padding,
      ),
    )

    setPillWidth(calculatedWidth)
    setVisibleTagsCount(visibleAdditionalTags)
  }, [filterTags, location, pickupTime, dropoffTime])

  // Additional tags that can be shown
  const additionalTags = filterTags.filter((tag) => !["location", "pickupTime", "dropoffTime"].includes(tag.type))
  const visibleAdditionalTags = additionalTags.slice(0, visibleTagsCount)
  const hiddenTagsCount = additionalTags.length - visibleTagsCount

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex flex-col items-center">
        <div
          className="flex items-center bg-background border-2 border-border rounded-full shadow-lg px-4 py-2 h-14 cursor-pointer hover:shadow-xl transition-all duration-300"
          style={{
            width: `${pillWidth}px`,
            minWidth: "500px",
            maxWidth: "90vw",
          }}
          onClick={onToggleExpanded}
        >
          {/* Filter Label */}
          <div className="flex items-center gap-2 mr-3 min-w-[70px] flex-shrink-0">
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

          {/* Filter Tags Container */}
          <div
            ref={tagsContainerRef}
            className="flex-1 flex items-center gap-2 overflow-hidden py-1"
            style={{ minWidth: 0 }} // Allow shrinking
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
                <span className="truncate max-w-[120px]">{tag.label}</span>
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
            {visibleAdditionalTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="px-2 py-1 text-xs whitespace-nowrap flex items-center gap-1 bg-muted/50 hover:bg-muted flex-shrink-0"
              >
                <span className="truncate max-w-[100px]">{tag.label}</span>
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

            {/* Show +X more if there are hidden tags */}
            {hiddenTagsCount > 0 && (
              <Badge variant="outline" className="px-2 py-1 text-xs whitespace-nowrap bg-muted/50 flex-shrink-0">
                +{hiddenTagsCount} more
              </Badge>
            )}

            {/* Show "No additional filters" if only priority tags exist and they're empty */}
            {additionalTags.length === 0 && priorityTags.every((tag) => tag.isEmpty) && (
              <span className="text-muted-foreground text-sm">No filters selected</span>
            )}
          </div>

          {/* Dropdown Indicator */}
          <div className="ml-2 flex-shrink-0">
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Clear All Button - appears when filters are active */}
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

        {/* Responsive indicator for very small screens */}
        {pillWidth >= window.innerWidth * 0.9 && (
          <div className="mt-1 text-xs text-muted-foreground">Tap to see all filters</div>
        )}
      </div>
    </div>
  )
}
