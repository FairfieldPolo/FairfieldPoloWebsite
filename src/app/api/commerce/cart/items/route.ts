import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEDUSA_CART_COOKIE, cartCookieOptions } from '@/lib/commerce/cart-cookie'
import { getMedusaSdk, isMedusaConfigured } from '@/lib/medusa/server'
import { getDefaultRegionId } from '@/lib/medusa/region'

export const dynamic = 'force-dynamic'

async function getOrCreateCartId(): Promise<string | null> {
  const store = await cookies()
  let cartId = store.get(MEDUSA_CART_COOKIE)?.value ?? null
  const sdk = getMedusaSdk()

  if (cartId) {
    try {
      await sdk.store.cart.retrieve(cartId)
      return cartId
    } catch {
      store.delete(MEDUSA_CART_COOKIE)
      cartId = null
    }
  }

  const regionId = await getDefaultRegionId(sdk)
  const { cart } = await sdk.store.cart.create({ region_id: regionId })
  if (!cart?.id) return null
  store.set(MEDUSA_CART_COOKIE, cart.id, cartCookieOptions)
  return cart.id
}

export async function POST(req: Request) {
  if (!isMedusaConfigured()) {
    return NextResponse.json({ ok: false as const, error: 'not_configured' }, { status: 503 })
  }

  let body: { variant_id?: string; quantity?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false as const, error: 'invalid_json' }, { status: 400 })
  }

  const variantId = body.variant_id?.trim()
  const quantity = Math.min(99, Math.max(1, Math.floor(body.quantity ?? 1)))
  if (!variantId) {
    return NextResponse.json({ ok: false as const, error: 'missing_variant_id' }, { status: 400 })
  }

  try {
    const sdk = getMedusaSdk()
    const cartId = await getOrCreateCartId()
    if (!cartId) {
      return NextResponse.json({ ok: false as const, error: 'cart_create_failed' }, { status: 500 })
    }

    const { cart } = await sdk.store.cart.createLineItem(
      cartId,
      { variant_id: variantId, quantity },
      {
        fields:
          '*items,*items.variant,*items.variant.product,*items.thumbnail,*items.metadata',
      }
    )

    return NextResponse.json({ ok: true as const, cart })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown_error'
    return NextResponse.json({ ok: false as const, error: message }, { status: 400 })
  }
}
