'use client'

import type { HttpTypes } from '@medusajs/types'

import {
  calculateServiceFeeAmount,
  getServiceFeeConfig,
} from '@/lib/commerce/service-fee'
import {
  formatCartMoney,
  getCartCurrencyCode,
  getCartMerchandiseSubtotalMajor,
} from '@/lib/commerce/medusa-money'

type Props = {
  cart: HttpTypes.StoreCart
}

/**
 * Merchandise lines and tax/shipping come from Medusa. Optional fee row is config-driven
 * for transparency; payment still follows Medusa + your payment provider (e.g. Stripe).
 */
export function CartTotals({ cart }: Props) {
  const currency = getCartCurrencyCode(cart)
  const feeConfig = getServiceFeeConfig()
  const merchandiseSubtotal = getCartMerchandiseSubtotalMajor(cart, currency)
  const feeAmount = calculateServiceFeeAmount(feeConfig, merchandiseSubtotal)

  return (
    <div className="border border-polo-cream-dark rounded-sm bg-white p-6 space-y-3 font-body text-polo-charcoal">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Merchandise</span>
        <span>{formatCartMoney(cart.item_subtotal ?? null, currency)}</span>
      </div>
      {cart.shipping_total != null && cart.shipping_total > 0 ? (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{formatCartMoney(cart.shipping_total, currency)}</span>
        </div>
      ) : null}
      {cart.tax_total != null && cart.tax_total > 0 ? (
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span>{formatCartMoney(cart.tax_total, currency)}</span>
        </div>
      ) : null}
      {feeConfig.enabled && feeAmount > 0 ? (
        <div className="flex justify-between text-sm border-t border-polo-cream-dark pt-3">
          <span className="text-gray-600">
            {feeConfig.label}
            {feeConfig.mode === 'percent' && feeConfig.percent != null
              ? ` (${feeConfig.percent}%)`
              : null}
          </span>
          <span>
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency,
            }).format(feeAmount)}
          </span>
        </div>
      ) : null}
      {feeConfig.enabled && feeConfig.mode === 'percent' && feeAmount > 0 ? (
        <p className="text-xs text-gray-500 leading-snug">
          Fee row is informational unless the same amount is represented in Medusa (e.g. via a
          fee product or custom module). Have pricing and card-network rules reviewed for your
          jurisdiction.
        </p>
      ) : null}
      <div className="flex justify-between font-semibold text-lg pt-2 border-t border-polo-cream-dark">
        <span>Order total (Medusa)</span>
        <span>{formatCartMoney(cart.total ?? null, currency)}</span>
      </div>
    </div>
  )
}
