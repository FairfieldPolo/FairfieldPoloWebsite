export function formatMoney(amount: number, currencyCode: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
  }).format(amount)
}

/** Medusa money fields often use string decimal amounts. */
export function parseMoneyAmount(value: string | number | undefined | null): number {
  if (value == null) return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const n = Number.parseFloat(value)
  return Number.isFinite(n) ? n : 0
}
