'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useState } from 'react'
import type { HttpTypes } from '@medusajs/types'

import { resolveMedusaAssetUrl } from '@/lib/commerce/assets'
import { formatCartMoney, getCartCurrencyCode } from '@/lib/commerce/medusa-money'

import { CartTotals } from './CartTotals'

export function CartPageClient() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/commerce/cart')
      const data = await res.json()
      if (!data.ok) {
        setError('Cart could not be loaded.')
        setCart(null)
        return
      }
      setCart(data.cart ?? null)
      setError(null)
    } catch {
      setError('Cart could not be loaded.')
      setCart(null)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function setQty(lineId: string, quantity: number) {
    try {
      const res = await fetch(`/api/commerce/cart/items/${encodeURIComponent(lineId)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity }),
      })
      const data = await res.json()
      if (data.ok && data.cart) setCart(data.cart)
    } catch {
      alert('Could not update quantity')
    }
  }

  async function removeLine(lineId: string) {
    try {
      const res = await fetch(`/api/commerce/cart/items/${encodeURIComponent(lineId)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.ok && data.cart !== undefined) setCart(data.cart ?? null)
    } catch {
      alert('Could not remove item')
    }
  }

  if (cart === undefined) {
    return (
      <div className="py-20 text-center font-body text-gray-500">Loading cart…</div>
    )
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="font-body text-gray-600 mb-4">{error}</p>
        <button type="button" className="btn-outline" onClick={load}>
          Retry
        </button>
      </div>
    )
  }

  if (!cart || !cart.items?.length) {
    return (
      <div className="text-center py-16 max-w-lg mx-auto">
        <p className="font-body text-gray-600 mb-6">Your cart is empty.</p>
        <Link href="/store" className="btn-gold inline-flex">
          Browse products
        </Link>
      </div>
    )
  }

  const currency = getCartCurrencyCode(cart)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      <div className="lg:col-span-2 space-y-6">
        {cart.items.map((line) => {
          const thumb =
            resolveMedusaAssetUrl(
              line.thumbnail ?? line.variant?.product?.thumbnail ?? undefined
            ) ?? null
          const title =
            line.product_title ??
            line.variant?.product?.title ??
            'Item'
          const variantTitle = line.variant?.title

          return (
            <div
              key={line.id}
              className="flex gap-4 items-start border border-polo-cream-dark rounded-sm p-4 bg-white"
            >
              <div className="relative w-24 h-24 flex-shrink-0 bg-polo-cream-dark rounded-sm overflow-hidden">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={title}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : null}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-polo-charcoal">{title}</div>
                {variantTitle ? (
                  <div className="text-sm text-gray-500">{variantTitle}</div>
                ) : null}
                <div className="text-sm text-gray-600 mt-1">
                  {formatCartMoney(line.unit_price, currency)} each
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-3">
                  <label className="text-sm text-gray-600">
                    Qty{' '}
                    <input
                      type="number"
                      min={1}
                      max={99}
                      className="input-polo w-20 py-1 inline-block ml-1"
                      defaultValue={line.quantity}
                      key={line.quantity}
                      onBlur={(e) => {
                        const q = Number.parseInt(e.target.value, 10)
                        if (Number.isFinite(q)) setQty(line.id, q)
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    className="text-sm text-red-700 hover:underline"
                    onClick={() => removeLine(line.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="font-semibold text-polo-charcoal">
                {formatCartMoney(line.subtotal ?? null, currency)}
              </div>
            </div>
          )
        })}
      </div>
      <div>
        <CartTotals cart={cart} />
        <Link
          href="/store/checkout"
          className="btn-gold w-full justify-center mt-6"
        >
          Checkout
        </Link>
      </div>
    </div>
  )
}
