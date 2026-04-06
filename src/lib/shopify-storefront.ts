/**
 * Server-only Storefront API helpers (used from Route Handlers).
 * Token: SHOPIFY_STOREFRONT_TOKEN (preferred) or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN.
 */

const DEFAULT_DOMAIN = 'fairfieldpolo.myshopify.com'
const STOREFRONT_API_VERSION = '2024-10'

export function getShopifyStorefrontConfig() {
  const domain = (
    process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim() || DEFAULT_DOMAIN
  ).replace(/^https?:\/\//, '')
  const token = (
    process.env.SHOPIFY_STOREFRONT_TOKEN ||
    process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ||
    ''
  ).trim()
  return { domain, token, configured: Boolean(token) }
}

type CacheOpts = { revalidate: number } | { revalidate: false }

export async function storefrontGraphql<T>(
  query: string,
  variables?: Record<string, unknown>,
  cache?: CacheOpts
): Promise<T> {
  const { domain, token } = getShopifyStorefrontConfig()
  if (!token) {
    throw new Error('Shopify Storefront API token is not configured')
  }

  const next =
    cache?.revalidate === false
      ? { revalidate: 0 as const }
      : { revalidate: cache?.revalidate ?? 0 }

  const res = await fetch(
    `https://${domain}/api/${STOREFRONT_API_VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
      next,
    }
  )

  const json: {
    data?: T
    errors?: { message: string }[]
  } = await res.json()

  if (!res.ok) {
    throw new Error(json.errors?.[0]?.message || `Shopify HTTP ${res.status}`)
  }
  if (json.errors?.length) {
    throw new Error(json.errors.map((e) => e.message).join('; '))
  }
  if (!json.data) {
    throw new Error('Empty Shopify response')
  }
  return json.data
}
