import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEDUSA_CART_COOKIE } from '@/lib/commerce/cart-cookie'
import { getMedusaSdk, isMedusaConfigured } from '@/lib/medusa/server'

export const dynamic = 'force-dynamic'

type RouteContext = { params: Promise<{ lineId: string }> }

export async function PATCH(req: Request, ctx: RouteContext) {
  if (!isMedusaConfigured()) {
    return NextResponse.json({ ok: false as const, error: 'not_configured' }, { status: 503 })
  }

  const { lineId } = await ctx.params
  const cartId = (await cookies()).get(MEDUSA_CART_COOKIE)?.value
  if (!cartId) {
    return NextResponse.json({ ok: false as const, error: 'no_cart' }, { status: 400 })
  }

  let body: { quantity?: number }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false as const, error: 'invalid_json' }, { status: 400 })
  }

  const quantity = Math.min(99, Math.max(0, Math.floor(body.quantity ?? 0)))

  try {
    const sdk = getMedusaSdk()
    const fields = {
      fields:
        '*items,*items.variant,*items.variant.product,*items.thumbnail,*items.metadata',
    } as const

    if (quantity <= 0) {
      const res = await sdk.store.cart.deleteLineItem(cartId, lineId, fields)
      return NextResponse.json({ ok: true as const, cart: res.parent })
    }

    const { cart } = await sdk.store.cart.updateLineItem(
      cartId,
      lineId,
      { quantity },
      fields
    )
    return NextResponse.json({ ok: true as const, cart })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown_error'
    return NextResponse.json({ ok: false as const, error: message }, { status: 400 })
  }
}

export async function DELETE(_req: Request, ctx: RouteContext) {
  if (!isMedusaConfigured()) {
    return NextResponse.json({ ok: false as const, error: 'not_configured' }, { status: 503 })
  }

  const { lineId } = await ctx.params
  const cartId = (await cookies()).get(MEDUSA_CART_COOKIE)?.value
  if (!cartId) {
    return NextResponse.json({ ok: false as const, error: 'no_cart' }, { status: 400 })
  }

  try {
    const sdk = getMedusaSdk()
    const res = await sdk.store.cart.deleteLineItem(cartId, lineId, {
      fields:
        '*items,*items.variant,*items.variant.product,*items.thumbnail,*items.metadata',
    })
    return NextResponse.json({ ok: true as const, cart: res.parent })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'unknown_error'
    return NextResponse.json({ ok: false as const, error: message }, { status: 400 })
  }
}
