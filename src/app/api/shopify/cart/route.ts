import { NextResponse } from 'next/server'

import {
  getShopifyStorefrontConfig,
  storefrontGraphql,
} from '@/lib/shopify-storefront'

export const dynamic = 'force-dynamic'

const CART_FIELDS = `
  id
  checkoutUrl
  totalQuantity
  cost {
    totalAmount {
      amount
      currencyCode
    }
  }
  lines(first: 50) {
    edges {
      node {
        id
        quantity
        merchandise {
          ... on ProductVariant {
            id
            title
            image {
              url
              altText
            }
            price {
              amount
              currencyCode
            }
            product {
              title
            }
          }
        }
      }
    }
  }
`

const CART_QUERY = `#graphql
  query CartQuery($id: ID!) {
    cart(id: $id) {
      ${CART_FIELDS}
    }
  }
`

const CART_CREATE = `#graphql
  mutation CartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_ADD = `#graphql
  mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`

const CART_LINES_REMOVE = `#graphql
  mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart {
        ${CART_FIELDS}
      }
      userErrors {
        field
        message
      }
    }
  }
`

type CartPayload = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  cost: {
    totalAmount: { amount: string; currencyCode: string }
  }
  lines: {
    edges: {
      node: {
        id: string
        quantity: number
        merchandise: {
          id: string
          title: string
          image: { url: string; altText: string | null } | null
          price: { amount: string; currencyCode: string }
          product: { title: string }
        }
      }
    }[]
  }
}

function mapCart(cart: CartPayload | null | undefined) {
  if (!cart) return null
  return {
    id: cart.id,
    checkoutUrl: cart.checkoutUrl,
    totalQuantity: cart.totalQuantity,
    totalAmount: cart.cost.totalAmount,
    lines: cart.lines.edges.map(({ node: line }) => ({
      id: line.id,
      quantity: line.quantity,
      title: line.merchandise.product.title,
      variantTitle: line.merchandise.title,
      imageUrl: line.merchandise.image?.url ?? null,
      imageAlt: line.merchandise.image?.altText ?? null,
      price: line.merchandise.price,
    })),
  }
}

type MergeBody = {
  operation: 'merge'
  cartId?: string | null
  lines: { merchandiseId: string; quantity: number }[]
}

type RemoveBody = {
  operation: 'remove'
  cartId: string
  lineIds: string[]
}

export async function GET(req: Request) {
  if (!getShopifyStorefrontConfig().configured) {
    return NextResponse.json(
      { ok: false as const, error: 'not_configured' },
      { status: 503 }
    )
  }

  const id = new URL(req.url).searchParams.get('id')
  if (!id) {
    return NextResponse.json(
      { ok: false as const, error: 'missing_id' },
      { status: 400 }
    )
  }

  try {
    const data = await storefrontGraphql<{
      cart: CartPayload | null
    }>(CART_QUERY, { id })
    return NextResponse.json({
      ok: true as const,
      cart: mapCart(data.cart),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json(
      { ok: false as const, error: message },
      { status: 400 }
    )
  }
}

export async function POST(req: Request) {
  if (!getShopifyStorefrontConfig().configured) {
    return NextResponse.json(
      { ok: false as const, error: 'not_configured' },
      { status: 503 }
    )
  }

  let body: MergeBody | RemoveBody
  try {
    body = (await req.json()) as MergeBody | RemoveBody
  } catch {
    return NextResponse.json(
      { ok: false as const, error: 'invalid_json' },
      { status: 400 }
    )
  }

  try {
    if (body.operation === 'remove') {
      const data = await storefrontGraphql<{
        cartLinesRemove: {
          cart: CartPayload | null
          userErrors: { field: string[] | null; message: string }[]
        }
      }>(CART_LINES_REMOVE, {
        cartId: body.cartId,
        lineIds: body.lineIds,
      })
      const err = data.cartLinesRemove.userErrors?.[0]
      if (err) {
        return NextResponse.json(
          { ok: false as const, error: err.message },
          { status: 400 }
        )
      }
      return NextResponse.json({
        ok: true as const,
        cart: mapCart(data.cartLinesRemove.cart),
      })
    }

    if (body.operation !== 'merge' || !body.lines?.length) {
      return NextResponse.json(
        { ok: false as const, error: 'invalid_body' },
        { status: 400 }
      )
    }

    const lineInputs = body.lines.map((l) => ({
      merchandiseId: l.merchandiseId,
      quantity: Math.min(99, Math.max(1, Math.floor(l.quantity || 1))),
    }))

    if (body.cartId) {
      const data = await storefrontGraphql<{
        cartLinesAdd: {
          cart: CartPayload | null
          userErrors: { field: string[] | null; message: string }[]
        }
      }>(CART_LINES_ADD, {
        cartId: body.cartId,
        lines: lineInputs,
      })
      const err = data.cartLinesAdd.userErrors?.[0]
      if (err) {
        // Stale cart — create fresh
        const created = await storefrontGraphql<{
          cartCreate: {
            cart: CartPayload | null
            userErrors: { field: string[] | null; message: string }[]
          }
        }>(CART_CREATE, {
          input: { lines: lineInputs },
        })
        const cErr = created.cartCreate.userErrors?.[0]
        if (cErr) {
          return NextResponse.json(
            { ok: false as const, error: cErr.message },
            { status: 400 }
          )
        }
        return NextResponse.json({
          ok: true as const,
          cart: mapCart(created.cartCreate.cart),
        })
      }
      return NextResponse.json({
        ok: true as const,
        cart: mapCart(data.cartLinesAdd.cart),
      })
    }

    const created = await storefrontGraphql<{
      cartCreate: {
        cart: CartPayload | null
        userErrors: { field: string[] | null; message: string }[]
      }
    }>(CART_CREATE, {
      input: { lines: lineInputs },
    })
    const cErr = created.cartCreate.userErrors?.[0]
    if (cErr) {
      return NextResponse.json(
        { ok: false as const, error: cErr.message },
        { status: 400 }
      )
    }
    return NextResponse.json({
      ok: true as const,
      cart: mapCart(created.cartCreate.cart),
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json(
      { ok: false as const, error: message },
      { status: 500 }
    )
  }
}
