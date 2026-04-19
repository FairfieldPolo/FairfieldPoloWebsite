import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { MEDUSA_CART_COOKIE } from '@/lib/commerce/cart-cookie'
import { getMedusaSdk, isMedusaConfigured } from '@/lib/medusa/server'

export const dynamic = 'force-dynamic'

const CART_FIELDS =
  'id,*items,*items.variant,*items.variant.product,*region,*payment_collection,*payment_collection.payment_sessions'

/**
 * Prepares checkout: updates cart email, starts payment session (e.g. Stripe via Medusa).
 * Payment still runs through the processor; this app never touches raw card data.
 */
export async function POST(req: Request) {
  if (!isMedusaConfigured()) {
    return NextResponse.json({ ok: false as const, error: 'not_configured' }, { status: 503 })
  }

  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    body = {}
  }

  const cartId = (await cookies()).get(MEDUSA_CART_COOKIE)?.value
  if (!cartId) {
    return NextResponse.json({ ok: false as const, error: 'no_cart' }, { status: 400 })
  }

  const providerId =
    process.env.NEXT_PUBLIC_MEDUSA_PAYMENT_PROVIDER_ID?.trim() || 'pp_stripe_stripe'

  try {
    const sdk = getMedusaSdk()

    if (body.email?.trim()) {
      await sdk.store.cart.update(cartId, { email: body.email.trim() })
    }

    const { cart } = await sdk.store.cart.retrieve(cartId, {
      fields: CART_FIELDS,
    })

    if (!cart) {
      return NextResponse.json({ ok: false as const, error: 'cart_not_found' }, { status: 404 })
    }

    const { payment_collection } = await sdk.store.payment.initiatePaymentSession(
      cart,
      { provider_id: providerId },
      { fields: '*payment_sessions' }
    )

    return NextResponse.json({
      ok: true as const,
      payment_collection,
      cart,
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'checkout_init_failed'
    return NextResponse.json({ ok: false as const, error: message }, { status: 400 })
  }
}
