import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEDUSA_CART_COOKIE, cartCookieOptions } from '@/lib/commerce/cart-cookie'
import { getMedusaSdk, isMedusaConfigured } from '@/lib/medusa/server'
import { getDefaultRegionId } from '@/lib/medusa/region'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!isMedusaConfigured()) {
    return NextResponse.json({ ok: false as const, error: 'not_configured' }, { status: 503 })
  }

  const cartId = (await cookies()).get(MEDUSA_CART_COOKIE)?.value
  if (!cartId) {
    return NextResponse.json({ ok: true as const, cart: null })
  }

  try {
    const sdk = getMedusaSdk()
    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields:
        '*items,*items.variant,*items.variant.product,*items.thumbnail,*items.metadata',
    })
    return NextResponse.json({ ok: true as const, cart })
  } catch {
    const store = await cookies()
    store.delete(MEDUSA_CART_COOKIE)
    return NextResponse.json({ ok: true as const, cart: null })
  }
}

export async function POST() {
  if (!isMedusaConfigured()) {
    return NextResponse.json({ ok: false as const, error: 'not_configured' }, { status: 503 })
  }

  try {
    const sdk = getMedusaSdk()
    const regionId = await getDefaultRegionId(sdk)
    const { cart } = await sdk.store.cart.create({ region_id: regionId })
    if (!cart?.id) {
      return NextResponse.json(
        { ok: false as const, error: 'cart_create_failed' },
        { status: 500 }
      )
    }
    const store = await cookies()
    store.set(MEDUSA_CART_COOKIE, cart.id, cartCookieOptions)
    return NextResponse.json({ ok: true as const, cart })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown_error'
    return NextResponse.json({ ok: false as const, error: message }, { status: 500 })
  }
}
