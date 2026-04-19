/**
 * Resolve Medusa asset URLs (API may return absolute or root-relative paths).
 * Set both MEDUSA_BACKEND_URL and NEXT_PUBLIC_MEDUSA_BACKEND_URL to the same public API URL.
 */
export function resolveMedusaAssetUrl(
  url: string | null | undefined
): string | null {
  if (!url) return null
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = (
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ||
    process.env.MEDUSA_BACKEND_URL ||
    ''
  ).replace(/\/$/, '')
  if (!base) return url.startsWith('/') ? url : `/${url}`
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}
