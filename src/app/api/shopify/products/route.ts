import { NextResponse } from 'next/server'

import {
  getShopifyStorefrontConfig,
  storefrontGraphql,
} from '@/lib/shopify-storefront'

export const dynamic = 'force-dynamic'

const PRODUCTS_QUERY = `#graphql
  query StoreProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          handle
          featuredImage {
            url
            altText
            width
            height
          }
          variants(first: 50) {
            edges {
              node {
                id
                title
                availableForSale
                price {
                  amount
                  currencyCode
                }
                compareAtPrice {
                  amount
                  currencyCode
                }
              }
            }
          }
        }
      }
    }
  }
`

type ProductsData = {
  products: {
    edges: {
      node: {
        id: string
        title: string
        handle: string
        featuredImage: {
          url: string
          altText: string | null
          width: number | null
          height: number | null
        } | null
        variants: {
          edges: {
            node: {
              id: string
              title: string
              availableForSale: boolean
              price: { amount: string; currencyCode: string }
              compareAtPrice: { amount: string; currencyCode: string } | null
            }
          }[]
        }
      }
    }[]
  }
}

export async function GET() {
  if (!getShopifyStorefrontConfig().configured) {
    return NextResponse.json(
      { ok: false as const, error: 'not_configured' },
      { status: 503 }
    )
  }

  try {
    const data = await storefrontGraphql<ProductsData>(
      PRODUCTS_QUERY,
      { first: 48 },
      { revalidate: 60 }
    )

    const products = data.products.edges.map(({ node: p }) => ({
      id: p.id,
      title: p.title,
      handle: p.handle,
      imageUrl: p.featuredImage?.url ?? null,
      imageAlt: p.featuredImage?.altText ?? p.title,
      imageWidth: p.featuredImage?.width ?? null,
      imageHeight: p.featuredImage?.height ?? null,
      variants: p.variants.edges.map(({ node: v }) => ({
        id: v.id,
        title: v.title,
        availableForSale: v.availableForSale,
        price: v.price,
        compareAtPrice: v.compareAtPrice,
      })),
    }))

    return NextResponse.json({ ok: true as const, products })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return NextResponse.json(
      { ok: false as const, error: message },
      { status: 500 }
    )
  }
}
