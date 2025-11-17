"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

export interface AspectRatioProps
  extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(
  ({ ratio = 16 / 9, style, className, children, ...props }, ref) => {
    const paddingBottom = React.useMemo(() => `${100 / ratio}%`, [ratio])

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: "100%",
          paddingBottom,
          ...style,
        }}
        className={cn("w-full overflow-hidden", className)}
        {...props}
      >
        <div className="absolute inset-0 h-full w-full">{children}</div>
      </div>
    )
  }
)
AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
