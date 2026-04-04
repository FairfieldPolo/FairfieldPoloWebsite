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
  current: string
}

// ─── Event ────────────────────────────────────────────────────
export type EventType = 'match' | 'charity' | 'tournament' | 'private' | 'practice'

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
  location?: string
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
export interface SiteSettings {
  siteName: string
  tagline: string
  description: string
  logo?: SanityImage
  heroImage?: SanityImage
  address: string
  phone?: string
  email: string
  googleMapsUrl?: string
  instagramHandle?: string
  facebookUrl?: string
  youtubeUrl?: string
  foundedYear: number
  uspaMember: boolean
}

// ─── Nav link ─────────────────────────────────────────────────
export interface NavLink {
  label: string
  href: string
  isExternal?: boolean
}
