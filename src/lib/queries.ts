// All GROQ queries for the site. Centralized so schema changes
// only need to be updated here.

export const SITE_SETTINGS_QUERY = `
  *[_type == "siteSettings"][0] {
    siteName, tagline, description,
    logo, heroImage,
    address, phone, email, googleMapsUrl,
    locations[] { _key, label, addressLine1, addressLine2, googleMapsUrl, latitude, longitude },
    instagramHandle, facebookUrl, youtubeUrl,
    foundedYear, uspaMember,
    publicPoloWhen, publicPoloNarrative, publicGates, publicGatesStat,
    publicPoloTimeCallout, publicPoloTimeContact, publicPoloTimeDetail, publicPoloStatTime, publicPoloSeo,
    publicPoloNoEvents, publicPoloEmptyEvents, publicPoloEmptySchedule,
    publicPoloGetInvolved, publicPoloScheduleCard, publicPoloWeatherNote
  }
`

const VENUE_PROJECTION = `venue->{ _id, label, addressLine1, addressLine2, googleMapsUrl, latitude, longitude }`

export const FEATURED_EVENTS_QUERY = `
  *[_type == "event" && isFeatured == true && date >= now()]
  | order(date asc)[0...4] {
    _id, title, slug, date, endDate,
    eventType, shortDescription, image,
    admissionFee, isPublic, isFeatured,
    ${VENUE_PROJECTION}
  }
`

export const ALL_UPCOMING_EVENTS_QUERY = `
  *[_type == "event" && date >= now()]
  | order(date asc) {
    _id, title, slug, date, endDate,
    eventType, shortDescription, image,
    location, admissionFee, isPublic,
    ${VENUE_PROJECTION}
  }
`

export const PAST_EVENTS_QUERY = `
  *[_type == "event" && date < now()]
  | order(date desc)[0...20] {
    _id, title, slug, date,
    eventType, shortDescription, image,
    ${VENUE_PROJECTION}
  }
`

export const EVENT_BY_SLUG_QUERY = `
  *[_type == "event" && slug.current == $slug][0] {
    _id, title, slug, date, endDate,
    eventType, description, shortDescription, image,
    location, admissionFee, ticketUrl,
    isPublic, isFeatured,
    ${VENUE_PROJECTION},
    sponsors[]-> { _id, name, logo, website, tier }
  }
`

export const ACTIVE_ANNOUNCEMENTS_QUERY = `
  *[_type == "announcement" && publishedAt <= now()
    && (expiresAt == null || expiresAt > now())]
  | order(pinned desc, publishedAt desc)[0...5] {
    _id, title, body, publishedAt, expiresAt, pinned, type
  }
`

export const SPONSORS_QUERY = `
  *[_type == "sponsor"]
  | order(tier asc, name asc) {
    _id, name, logo, website, tier
  }
`

export const EDUCATION_ARTICLES_QUERY = `
  *[_type == "educationArticle"]
  | order(category asc, title asc) {
    _id, title, slug, category,
    excerpt, image, difficulty, publishedAt
  }
`

export const ARTICLE_BY_SLUG_QUERY = `
  *[_type == "educationArticle" && slug.current == $slug][0] {
    _id, title, slug, category,
    excerpt, body, image, difficulty, publishedAt
  }
`

export const GALLERY_QUERY = `
  *[_type == "gallery"] | order(_createdAt desc)[0] {
    images[] { _key, image, caption, takenAt }
  }
`
