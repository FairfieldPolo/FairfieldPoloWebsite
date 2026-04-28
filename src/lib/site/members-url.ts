const trim = (s: string) => s.replace(/\/$/, '')

const siteOrigin = () =>
  trim(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fairfieldpolo.com')

/**
 * Set to the **exact** public home URL of the members app: bare origin
 * (e.g. `https://members.fairfieldpolo.com` when the app is served at `/` on that host)
 * or origin + path when the app lives on a subpath
 * (e.g. `https://app.fairfieldpolo.com/members/portal`). Trailing slashes are ignored.
 * Leave unset to use the in-app `/members` “coming soon” page until the members site is live.
 */
function membersOriginFromEnv(): string {
  return trim(process.env.NEXT_PUBLIC_MEMBERS_URL?.trim() ?? '')
}

/**
 * When `NEXT_PUBLIC_MEMBERS_URL` is set, marketing `/members` redirects to this value
 * (must stay in sync with `membersUrl()`). Used from `next.config` redirects.
 */
export function getExternalMembersAppBaseForRedirects(): string | null {
  const b = membersOriginFromEnv()
  return b || null
}

/** Main nav and links: app route or external members origin. */
export function membersUrl(): string {
  const origin = membersOriginFromEnv()
  if (origin) return origin
  return '/members'
}

/** Sitemap: absolute URL for the public members page. */
export function membersPageAbsoluteUrl(): string {
  const origin = membersOriginFromEnv()
  if (origin) return origin
  return `${siteOrigin()}/members`
}
