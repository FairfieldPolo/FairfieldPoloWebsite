'use client'

import { useState } from 'react'

type Props = {
  variantId: string
  disabled?: boolean
  className?: string
}

export function AddToCartButton({ variantId, disabled, className }: Props) {
  const [loading, setLoading] = useState(false)

  async function add() {
    if (!variantId || disabled) return
    setLoading(true)
    try {
      const res = await fetch('/api/commerce/cart/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variant_id: variantId, quantity: 1 }),
      })
      const data = await res.json()
      if (!data.ok) {
        throw new Error(data.error ?? 'Could not add to cart')
      }
    } catch (e) {
      console.error(e)
      alert(e instanceof Error ? e.message : 'Could not add to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      className={className ?? 'btn-primary w-full justify-center'}
      disabled={disabled || loading || !variantId}
      onClick={add}
    >
      {loading ? 'Adding…' : 'Add to cart'}
    </button>
  )
}
