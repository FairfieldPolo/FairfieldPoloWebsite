import type { PortableTextBlock } from '@portabletext/react'

// ─── Sanity image ──────────────────────────────────────────────
export interface SanityImage {
  _type: 'image'
  asset: { _ref: string; _type: 'reference' }
  alt?: string
  caption?: string
}

// ─── Slug ──────────────────────────────────────────────────────
export interface Slug {
  _type?: 'slug'
  current: string
}

// ─── Event ────────────────────────────────────────────────────
export type EventType =
  | 'match'
  | 'charity'
  | 'tournament'
  | 'private'
  | 'social'
  | 'practice'
  | 'lesson'

/** Reusable venue — `event.venue` reference in Sanity. */
export interface Venue {
  _id: string
  label: string
  addressLine1?: string
  addressLine2?: string
  googleMapsUrl?: string
  /** Decimal degrees — optional exact pin when both set. */
  latitude?: number
  longitude?: number
}

export interface PoloEvent {
  _id: string
  title: string
  slug: Slug
  date: string            // ISO datetime
  endDate?: string
  eventType: EventType
  description?: PortableTextBlock[]
  shortDescription?: string
  image?: SanityImage
  /** Optional notes shown with `venue` (e.g. “Field B”). */
  location?: string
  /** Where this event happens (pick from Locations in Studio). */
  venue?: Venue | null
  admissionFee?: string   // e.g. "Free" | "$10 per car"
  ticketUrl?: string
  isPublic: boolean
  isFeatured: boolean
  sponsors?: Sponsor[]
}

// ─── Sponsor ──────────────────────────────────────────────────
export type SponsorTier = 'title' | 'gold' | 'silver' | 'supporting'

export interface Sponsor {
  _id: string
  name: string
  logo?: SanityImage
  website?: string
  tier: SponsorTier
  activeSeasons?: string[]
}

// ─── Announcement ─────────────────────────────────────────────
export interface Announcement {
  _id: string
  title: string
  body: PortableTextBlock[]
  publishedAt: string
  expiresAt?: string
  pinned: boolean
  type: 'general' | 'weather' | 'schedule' | 'urgent'
}

// ─── Education article ─────────────────────────────────────────
export type ArticleCategory = 'rules' | 'equipment' | 'history' | 'glossary' | 'howtowatch'

export interface EducationArticle {
  _id: string
  title: string
  slug: Slug
  category: ArticleCategory
  excerpt?: string
  body: PortableTextBlock[]
  image?: SanityImage
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  publishedAt: string
}

// ─── Gallery image ─────────────────────────────────────────────
export interface GalleryImage {
  _key: string
  image: SanityImage
  caption?: string
  takenAt?: string
}

// ─── Site settings (singleton) ─────────────────────────────────
export interface ClubLocation {
  _key?: string
  label?: string
  addressLine1?: string
  addressLine2?: string
  googleMapsUrl?: string
  latitude?: number
  longitude?: number
}

export interface SiteSettings {
  siteName: string
  tagline: string
  description: string
  logo?: SanityImage
  heroImage?: SanityImage
  /** Legacy single-line address; used when `locations` is empty. */
  address?: string
  /** First entry is the primary venue (Contact map, footer). */
  locations?: ClubLocation[]
  phone?: string
  email: string
  googleMapsUrl?: string
  instagramHandle?: string
  facebookUrl?: string
  youtubeUrl?: string
  foundedYear: number
  uspaMember: boolean

  /** When weekly polo is open to the public (one sentence, sitewide). */
  publicPoloWhen?: string
  /** Home hero subhead under the main headline. */
  publicPoloNarrative?: string
  publicGates?: string
  publicGatesStat?: string
  publicPoloTimeCallout?: string
  publicPoloTimeContact?: string
  publicPoloTimeDetail?: string
  publicPoloStatTime?: string
  publicPoloSeo?: string
  publicPoloNoEvents?: string
  publicPoloEmptyEvents?: string
  publicPoloEmptySchedule?: string
  publicPoloGetInvolved?: string
  publicPoloScheduleCard?: string
  /** Rain/mud + check updates (home, events list, event detail). */
  publicPoloWeatherNote?: string
}

// ─── Nav link ─────────────────────────────────────────────────
export interface NavLink {
  label: string
  href: string
  isExternal?: boolean
}
