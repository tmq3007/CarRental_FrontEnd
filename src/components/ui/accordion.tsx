"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"

const Accordion = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("space-y-3", className)} {...props} />
  )
)
Accordion.displayName = "Accordion"

interface AccordionItemProps
  extends React.DetailsHTMLAttributes<HTMLDetailsElement> {
  defaultOpen?: boolean
}

const AccordionItem = React.forwardRef<HTMLDetailsElement, AccordionItemProps>(
  ({ className, children, defaultOpen, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(Boolean(defaultOpen))

    return (
      <details
        ref={ref}
        className={cn(
          "group rounded-xl border border-border bg-card p-4 shadow-sm transition duration-200",
          "open:shadow-md",
          className
        )}
        open={isOpen}
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
        {...props}
      >
        {children}
      </details>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

const AccordionTrigger = React.forwardRef<
  React.ElementRef<"summary">,
  React.ComponentPropsWithoutRef<"summary">
>(({ className, children, ...props }, ref) => (
  <summary
    ref={ref}
    className={cn(
      "flex cursor-pointer items-center justify-between text-sm font-semibold text-foreground",
      "transition-colors hover:text-primary [&::-webkit-details-marker]:hidden",
      className
    )}
    {...props}
  >
    <span>{children}</span>
    <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
  </summary>
))
AccordionTrigger.displayName = "AccordionTrigger"

const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("mt-3 space-y-2 text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
