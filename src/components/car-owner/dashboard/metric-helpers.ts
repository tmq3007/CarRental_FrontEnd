import type { ComponentType } from "react"

const integerFormatter = new Intl.NumberFormat()

export const formatInteger = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—"
  }
  return integerFormatter.format(value)
}

export const formatPercent = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—"
  }

  const normalized = value <= 1 ? value * 100 : value
  const fractionDigits = normalized !== 0 && normalized < 10 ? 1 : 0
  return `${normalized.toFixed(fractionDigits)}%`
}

export const formatDurationDays = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "—"
  }

  if (value < 1) {
    return "< 1 day"
  }

  return `${value.toFixed(1)} days`
}

export const isPositiveChange = (change?: string) => {
  if (!change) {
    return true
  }
  return !change.trim().startsWith("-")
}

export type MetricCard = {
  key: string
  title: string
  value: string
  change: string
  isPositive: boolean
  subtitle?: string
  icon: ComponentType<{ className?: string }>
  bgGradient: string
  iconBg: string
  iconColor: string
}
