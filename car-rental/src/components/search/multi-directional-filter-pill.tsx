"use client"
import { Badge } from "@/components/ui/badge"
import type React from "react"
import { Filter, X, ChevronDown, ChevronUp, Search, MapPin, Clock, Maximize2, Minimize2 } from "lucide-react"
import { useEffect, useState, useRef } from "react"

interface FilterTag {
  id: string
  label: string
  type: string
  value: any
  priority?: number
  isEmpty?: boolean
}

interface MultiDirectionalFilterPillProps {
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
  pickupTime: Date | undefined
  dropoffTime: Date | undefined
}

type ExpansionMode = "compact" | "horizontal" | "vertical" | "full"

export default function MultiDirectionalFilterPill({
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
}: MultiDirectionalFilterPillProps) {
  const [expansionMode, setExpansionMode] = useState<ExpansionMode>("compact")
  const [isVerticalExpanded, setIsVerticalExpanded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  // Format date to readable string
  const formatDate = (date: Date | undefined) => {
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

  // Calculate optimal expansion mode
  useEffect(() => {
    const calculateExpansionMode = () => {
      const screenWidth = window.innerWidth
      const maxHorizontalWidth = screenWidth * 0.95
      const baseWidth = 500

      // Estimate content width
      const estimatedContentWidth = allTags.reduce((total, tag) => {
        return total + Math.min(tag.label.length * 8 + 60, 200)
      }, 300) // Base width for filter label, search, and chevron

      if (estimatedContentWidth <= baseWidth) {
        setExpansionMode("compact")
      } else if (estimatedContentWidth <= maxHorizontalWidth) {
        setExpansionMode("horizontal")
      } else if (additionalTags.length > 6) {
        setExpansionMode("full")
      } else {
        setExpansionMode("vertical")
      }
    }

    calculateExpansionMode()
    window.addEventListener("resize", calculateExpansionMode)
    return () => window.removeEventListener("resize", calculateExpansionMode)
  }, [additionalTags.length])

  // Calculate dynamic dimensions
  const getDimensions = () => {
    const screenWidth = window.innerWidth
    const baseWidth = 500
    const maxWidth = Math.min(screenWidth * 0.95, 1400)

    switch (expansionMode) {
      case "compact":
        return { width: baseWidth, height: 56 }
      case "horizontal":
        const horizontalWidth = Math.min(
          allTags.reduce((total, tag) => total + Math.min(tag.label.length * 8 + 60, 200), 300),
          maxWidth,
        )
        return { width: horizontalWidth, height: 56 }
      case "vertical":
        return { width: Math.min(800, maxWidth), height: isVerticalExpanded ? "auto" : 56 }
      case "full":
        return { width: Math.min(1000, maxWidth), height: isVerticalExpanded ? "auto" : 56 }
      default:
        return { width: baseWidth, height: 56 }
    }
  }

  const dimensions = getDimensions()

  // Split tags into rows for vertical expansion
  const getTagRows = () => {
    if (!isVerticalExpanded || (expansionMode !== "vertical" && expansionMode !== "full")) {
      return [allTags]
    }

    const rows = []
    const priorityRow = priorityTags
    const additionalRows = []

    // Split additional tags into rows of 4-6 tags each
    const tagsPerRow = expansionMode === "full" ? 6 : 4
    for (let i = 0; i < additionalTags.length; i += tagsPerRow) {
      additionalRows.push(additionalTags.slice(i, i + tagsPerRow))
    }

    return [priorityRow, ...additionalRows].filter((row) => row.length > 0)
  }

  const tagRows = getTagRows()

  // Toggle vertical expansion
  const toggleVerticalExpansion = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsVerticalExpanded(!isVerticalExpanded)
  }

  // Cycle through expansion modes
  const cycleExpansionMode = (e: React.MouseEvent) => {
    e.stopPropagation()
    const modes: ExpansionMode[] = ["compact", "horizontal", "vertical", "full"]
    const currentIndex = modes.indexOf(expansionMode)
    const nextIndex = (currentIndex + 1) % modes.length
    setExpansionMode(modes[nextIndex])
  }

  return (
    <div className="sticky top-14 z-50 flex justify-center">
      <div className="flex flex-col items-center">
        {/* Main Filter Pill Container */}
        <div
          ref={containerRef}
          className="bg-background border-2 border-border rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl"
          style={{
            width: typeof dimensions.width === "number" ? `${dimensions.width}px` : dimensions.width,
            minWidth: "500px",
            maxWidth: "95vw",
            height: dimensions.height === "auto" ? "auto" : `${dimensions.height}px`,
            minHeight: "56px",
          }}
        >
          {/* Main Row */}
          <div className="flex items-center px-4 py-2 h-14 cursor-pointer" onClick={onToggleExpanded}>
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

            {/* Tags Container - First Row */}
            <div ref={tagsRef} className="flex-1 flex items-center gap-2 py-1 overflow-hidden" style={{ minWidth: 0 }}>
              {/* Show tags based on expansion mode */}
              {expansionMode === "compact" && (
                <>
                  {/* Always show priority tags (location and datetime) in compact mode */}
                  {priorityTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={tag.isEmpty ? "outline" : "secondary"}
                      className={`px-2 py-1 text-xs whitespace-nowrap flex items-center gap-1 flex-shrink-0 ${
                        tag.isEmpty ? "text-muted-foreground" : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      {tag.icon}
                      <span className="truncate max-w-[100px]">{tag.label}</span>
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
                  {/* Show additional filters count if any exist */}
                  {additionalTags.length > 0 && (
                    <Badge variant="outline" className="px-2 py-1 text-xs whitespace-nowrap bg-muted/50 flex-shrink-0">
                      +{additionalTags.length} more
                    </Badge>
                  )}
                </>
              )}

              {expansionMode === "horizontal" && (
                <>
                  {/* All tags in one row */}
                  {allTags.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant={tag.isEmpty ? "outline" : "secondary"}
                      className={`px-2 py-1 text-xs whitespace-nowrap flex items-center gap-1 flex-shrink-0 ${
                        tag.isEmpty ? "text-muted-foreground" : "bg-muted/50 hover:bg-muted"
                      }`}
                    >
                      {["location", "pickupTime", "dropoffTime"].includes(tag.type) &&
                        (priorityTags.find((pt) => pt.type === tag.type)?.icon)}
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
                </>
              )}

              {(expansionMode === "vertical" || expansionMode === "full") && (
                <>
                  {/* Priority tags in first row */}
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

                  {/* Show first few additional tags */}
                  {!isVerticalExpanded &&
                    additionalTags.slice(0, 2).map((tag) => (
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

                  {/* Vertical expand button */}
                  {additionalTags.length > 2 && (
                    <button
                      onClick={toggleVerticalExpansion}
                      className="flex items-center gap-1 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 rounded-md hover:bg-muted"
                    >
                      {isVerticalExpanded ? (
                        <>
                          <ChevronUp className="w-3 h-3" />
                          <span>Less</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3 h-3" />
                          <span>+{additionalTags.length - 2} more</span>
                        </>
                      )}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Control Buttons */}
            <div className="flex items-center gap-1 ml-2 flex-shrink-0">
              {/* Expansion Mode Toggle */}
              <button
                onClick={cycleExpansionMode}
                className="p-1 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-muted"
                title={`Current: ${expansionMode} mode`}
              >
                {expansionMode === "full" ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
              </button>

              {/* Main Dropdown Indicator */}
              <div>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </div>
          </div>

          {/* Additional Rows - Vertical Expansion */}
          {isVerticalExpanded &&
            (expansionMode === "vertical" || expansionMode === "full") &&
            tagRows.slice(1).map((row, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex items-center gap-2 px-4 py-2 border-t border-border/50">
                <div className="w-[70px] flex-shrink-0" /> {/* Spacer for alignment */}
                <div className="w-[150px] flex-shrink-0" /> {/* Spacer for search alignment */}
                <div className="flex-1 flex items-center gap-2 overflow-hidden">
                  {row.map((tag) => (
                    <Badge
                      key={tag.id}
                      variant="outline"
                      className="px-2 py-1 text-xs whitespace-nowrap flex items-center gap-1 bg-muted/50 hover:bg-muted flex-shrink-0"
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
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
