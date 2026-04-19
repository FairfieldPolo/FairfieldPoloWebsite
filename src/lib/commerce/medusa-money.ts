import type { HttpTypes } from '@medusajs/types'

import { formatMoney } from './money'

/** Medusa amounts in Store API are typically in the currency’s smallest unit (e.g. cents). */
const ZERO_DECIMAL = new Set(['JPY', 'KRW', 'VND'])

export function fromSmallestUnit(amount: number | undefined | null, currencyCode: string): number {
  if (amount == null || !Number.isFinite(amount)) return 0
  if (ZERO_DECIMAL.has(currencyCode.toUpperCase())) return amount
  return amount / 100
}

export function formatCartMoney(
  amount: number | undefined | null,
  currencyCode: string | undefined
): string {
  const code = currencyCode || 'USD'
  return formatMoney(fromSmallestUnit(amount, code), code)
}

export function getCartCurrencyCode(cart: HttpTypes.StoreCart): string {
  return (
    cart.currency_code?.toUpperCase() ??
    cart.region?.currency_code?.toUpperCase() ??
    'USD'
  )
}

/** Sum of line merchandise before service fee (uses cart.item_subtotal when present). */
export function getCartMerchandiseSubtotalMajor(
  cart: HttpTypes.StoreCart,
  currencyCode: string
): number {
  if (cart.item_subtotal != null) {
    return fromSmallestUnit(cart.item_subtotal, currencyCode)
  }
  const items = cart.items ?? []
  return items.reduce((sum, line) => {
    const unit = fromSmallestUnit(line.unit_price, currencyCode)
    return sum + unit * (line.quantity ?? 0)
  }, 0)
}
