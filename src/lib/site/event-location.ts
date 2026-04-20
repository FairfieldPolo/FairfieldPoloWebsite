import type { PoloEvent, Venue } from '@/types'
import {
  DEFAULT_CLUB_MAPS_QUERY,
  DEFAULT_MAIN_LOCATION,
  googleMapsSearchUrl,
} from '@/lib/site/location'

/** Single string for calendar / maps search from a venue document. */
export function venueMapsQuery(v: Venue): string {
  const a = v.addressLine1?.trim()
  const b = v.addressLine2?.trim()
  if (a && b) return `${a}, ${b}`
  if (a) return a
  if (b) return b
  return v.label.trim()
}

/** iCal LOCATION line: venue address, legacy free-text, or default club. */
export function eventLocationForCalendar(
  event: Pick<PoloEvent, 'venue' | 'location'>
): string {
  if (event.venue) return venueMapsQuery(event.venue)
  const t = event.location?.trim()
  if (t) return t
  return DEFAULT_CLUB_MAPS_QUERY
}

export type EventWhereDisplay = {
  title: string
  lines: string[]
  mapsHref: string
  /** Extra “location notes” from the event when a venue is selected. */
  notes?: string
}

/** Sidebar / UI copy for “where” this event happens. */
export function eventWhereDisplay(event: PoloEvent): EventWhereDisplay {
  const notes = event.location?.trim()

  if (event.venue) {
    const v = event.venue
    const lines = [v.addressLine1, v.addressLine2].filter((x): x is string => Boolean(x?.trim()))
    const mapsHref = v.googleMapsUrl?.trim() || googleMapsSearchUrl(venueMapsQuery(v))
    return {
      title: v.label,
      lines,
      mapsHref,
      notes: notes || undefined,
    }
  }

  if (notes) {
    return {
      title: notes,
      lines: [],
      mapsHref: googleMapsSearchUrl(notes),
    }
  }

  return {
    title: 'Fairfield Polo Club',
    lines: [DEFAULT_MAIN_LOCATION.line1, DEFAULT_MAIN_LOCATION.line2],
    mapsHref: googleMapsSearchUrl(DEFAULT_CLUB_MAPS_QUERY),
  }
}
