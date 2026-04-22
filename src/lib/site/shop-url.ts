const trimTrailingSlash = (s: string) => s.replace(/\/$/, '')

/**
 * Set on the main marketing site to the public shop origin, e.g. `https://shop.fairfieldpolo.com`.
 * Leave unset when this deployment is the store (local dev or the shop host).
 */
function shopOriginFromEnv(): string {
  return trimTrailingSlash(process.env.NEXT_PUBLIC_SHOP_URL?.trim() ?? '')
}

const siteOrigin = () =>
  trimTrailingSlash(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fairfieldpolo.com')

/**
 * Href for shop routes: full URL to the shop host when `NEXT_PUBLIC_SHOP_URL` is set, otherwise
 * a same-origin path (e.g. `/store`) for a single deploy that still serves the store.
 */
export function shopUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const origin = shopOriginFromEnv()
  if (origin) return `${origin}${p}`
  return p
}

/**
 * Always absolute, for sitemaps and metadata.
 */
export function shopPageAbsoluteUrl(path: string): string {
  const p = path.startsWith('/') ? path : `/${path}`
  const origin = shopOriginFromEnv()
  if (origin) return `${origin}${p}`
  return `${siteOrigin()}${p}`
}
