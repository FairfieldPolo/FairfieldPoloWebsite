import type { SiteSettings } from '@/types'

/** Canonical full address for maps search / embed (single string). */
export const DEFAULT_CLUB_MAPS_QUERY =
  '9420 South Broadway Avenue, Haysville, KS 67060' as const

export const DEFAULT_MAIN_LOCATION = {
  label: 'Main',
  line1: '9420 South Broadway Avenue',
  line2: 'Haysville, Kansas 67060',
  mapsQuery: DEFAULT_CLUB_MAPS_QUERY,
} as const

export type ResolvedClubLocation = {
  label: string
  line1: string
  line2?: string
  /** Single string passed to Google (search API, embed q=, etc.) */
  mapsQuery: string
  /** When both set, maps embed / links prefer this pin. */
  latitude?: number
  longitude?: number
}

export function hasValidCoords(lat?: number, lng?: number): boolean {
  return typeof lat === 'number' && typeof lng === 'number' && Number.isFinite(lat) && Number.isFinite(lng)
}

/** Maps search / `q=` string for a coordinate pin. */
export function coordsMapsQuery(lat: number, lng: number): string {
  return `${lat},${lng}`
}

/**
 * Stable “open in Google Maps” URL using the Maps search API (address/query, not lat/lng).
 * @see https://developers.google.com/maps/documentation/urls/get-started
 */
export function googleMapsSearchUrl(query: string): string {
  const q = encodeURIComponent(query.trim())
  return `https://www.google.com/maps/search/?api=1&query=${q}`
}

/**
 * Embedded map: prefers Maps Embed API when `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set (reliable).
 * Otherwise falls back to the common `output=embed` query URL (no API key).
 */
export function googleMapsEmbedSrc(query: string): string {
  const q = encodeURIComponent(query.trim())
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  if (key) {
    return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${q}`
  }
  return `https://www.google.com/maps?q=${q}&output=embed`
}

/** Embed for Contact / site settings: prefers lat/lng pin when both are set. */
export function googleMapsEmbedForResolved(loc: ResolvedClubLocation): string {
  if (hasValidCoords(loc.latitude, loc.longitude)) {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    const lat = loc.latitude as number
    const lng = loc.longitude as number
    if (key) {
      return `https://www.google.com/maps/embed/v1/view?key=${encodeURIComponent(key)}&center=${lat},${lng}&zoom=16&maptype=roadmap`
    }
    const q = encodeURIComponent(coordsMapsQuery(lat, lng))
    return `https://www.google.com/maps?q=${q}&output=embed`
  }
  return googleMapsEmbedSrc(loc.mapsQuery)
}

/**
 * Resolves the primary club location for maps + display.
 * Order: first entry in Sanity `locations` → legacy `address` string → code default.
 */
export function resolvePrimaryLocation(
  settings: Partial<SiteSettings> | null | undefined
): ResolvedClubLocation {
  const first = settings?.locations?.[0]
  const line1 = first?.addressLine1?.trim()
  const line2 = first?.addressLine2?.trim()
  const lat = first?.latitude
  const lng = first?.longitude

  if (line1 && line2) {
    return {
      label: first?.label?.trim() || 'Main',
      line1,
      line2,
      mapsQuery: `${line1}, ${line2}`,
      latitude:  hasValidCoords(lat, lng) ? lat : undefined,
      longitude: hasValidCoords(lat, lng) ? lng : undefined,
    }
  }

  if (hasValidCoords(lat, lng)) {
    const la = lat as number
    const ln = lng as number
    const label = first?.label?.trim() || 'Main'
    return {
      label,
      line1: line1 || label,
      line2: line2 || coordsMapsQuery(la, ln),
      mapsQuery: coordsMapsQuery(la, ln),
      latitude:  la,
      longitude: ln,
    }
  }

  const legacy = settings?.address?.trim()
  if (legacy) {
    return {
      label: 'Main',
      line1: legacy,
      mapsQuery: legacy,
    }
  }

  return {
    label: DEFAULT_MAIN_LOCATION.label,
    line1: DEFAULT_MAIN_LOCATION.line1,
    line2: DEFAULT_MAIN_LOCATION.line2,
    mapsQuery: DEFAULT_MAIN_LOCATION.mapsQuery,
  }
}

/**
 * One-line address for on-page copy (e.g. home events strip). Uses `mapsQuery` when set;
 * otherwise `line1` and `line2` so the UI never depends on a single field in isolation.
 */
export function displayAddressFromResolved(loc: ResolvedClubLocation): string {
  const q = loc.mapsQuery?.trim()
  if (q) return q
  return [loc.line1, loc.line2].filter(Boolean).join(', ').trim() || loc.line1
}

/** “Open in Google Maps” link: optional Sanity override, else search URL from `mapsQuery`. */
export function openInGoogleMapsHref(
  resolved: ResolvedClubLocation,
  settings: Partial<SiteSettings> | null | undefined
): string {
  const first = settings?.locations?.[0]
  const fromLocation = first?.googleMapsUrl?.trim()
  const siteWide = settings?.googleMapsUrl?.trim()
  if (fromLocation || siteWide) return (fromLocation || siteWide) as string
  if (hasValidCoords(resolved.latitude, resolved.longitude)) {
    return googleMapsSearchUrl(coordsMapsQuery(resolved.latitude!, resolved.longitude!))
  }
  return googleMapsSearchUrl(resolved.mapsQuery)
}
