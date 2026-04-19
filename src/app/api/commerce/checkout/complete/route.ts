import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEDUSA_CART_COOKIE } from '@/lib/commerce/cart-cookie'
import { getMedusaSdk, isMedusaConfigured } from '@/lib/medusa/server'

export const dynamic = 'force-dynamic'

/**
 * Finalizes the cart after the payment provider (e.g. Stripe) authorizes payment.
 * Medusa coordinates with the configured payment module.
 */
export async function POST() {
  if (!isMedusaConfigured()) {
    return NextResponse.json({ ok: false as const, error: 'not_configured' }, { status: 503 })
  }

  const cartId = (await cookies()).get(MEDUSA_CART_COOKIE)?.value
  if (!cartId) {
    return NextResponse.json({ ok: false as const, error: 'no_cart' }, { status: 400 })
  }

  try {
    const sdk = getMedusaSdk()
    const result = await sdk.store.cart.complete(cartId)

    const store = await cookies()
    store.delete(MEDUSA_CART_COOKIE)

    return NextResponse.json({ ok: true as const, result })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'complete_failed'
    return NextResponse.json({ ok: false as const, error: message }, { status: 400 })
  }
}
