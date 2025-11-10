import { formatCurrency as formatCurrencyInternal } from "@/lib/utils/format"

export const formatCurrency = (amount: number) => formatCurrencyInternal(amount)