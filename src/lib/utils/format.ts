import { format } from "date-fns"

type DateInput = string | number | Date | null | undefined

const DATE_FALLBACK_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "numeric",
})

const DEFAULT_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  hour: "2-digit",
  minute: "2-digit",
}

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined) return null
  const parsed = value instanceof Date ? new Date(value.getTime()) : new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return parsed
}

function formatWithPattern(
  value: DateInput,
  pattern: string,
  fallback?: string,
  fallbackFormatter?: (date: Date) => string,
) {
  const date = toDate(value)
  const fallbackValue = fallback ?? "—"
  if (!date) {
    return fallbackValue
  }

  try {
    return format(date, pattern)
  } catch (error) {
    if (fallbackFormatter) {
      return fallbackFormatter(date)
    }
    return fallbackValue
  }
}

export function formatDate(value: DateInput, pattern = "dd MMM yyyy", fallback?: string) {
  return formatWithPattern(value, pattern, fallback, (date) => DATE_FALLBACK_FORMATTER.format(date))
}

export function formatDateTime(value: DateInput, pattern = "dd MMM yyyy, HH:mm", fallback?: string) {
  return formatWithPattern(value, pattern, fallback, (date) => {
    const datePart = DATE_FALLBACK_FORMATTER.format(date)
    const timePart = date.toLocaleTimeString([], DEFAULT_TIME_OPTIONS)
    return `${datePart}, ${timePart}`
  })
}

export function formatCurrency(
  amount?: number | null,
  locale = "vi-VN",
  currency = "VND",
  fallback = "—",
) {
  if (typeof amount !== "number" || Number.isNaN(amount)) {
    return fallback
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

const MS_IN_DAY = 1000 * 60 * 60 * 24

export function formatDurationInDays(
  start?: DateInput,
  end?: DateInput,
  options?: {
    fallback?: string
    minimum?: number
    singularLabel?: string
    pluralLabel?: string
  },
) {
  const { fallback = "—", minimum = 1, singularLabel = "day", pluralLabel = "days" } = options ?? {}
  const startDate = toDate(start)
  const endDate = toDate(end)

  if (!startDate || !endDate) {
    return fallback
  }

  const diffMs = endDate.getTime() - startDate.getTime()
  if (diffMs < 0) {
    return fallback
  }

  const days = Math.max(minimum, Math.round(diffMs / MS_IN_DAY))
  const label = days === 1 ? singularLabel : pluralLabel
  return `${days} ${label}`
}

export function isValidDate(value: DateInput) {
  return toDate(value) !== null
}

export const formatVnd = (cents: number): string => {
  const safeValue = Number.isFinite(cents) ? cents : 0
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(safeValue)
}

export const formatDateTimeVi = (value?: DateInput): string | null => {
  const date = toDate(value)
  if (!date) {
    return null
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date)
}
