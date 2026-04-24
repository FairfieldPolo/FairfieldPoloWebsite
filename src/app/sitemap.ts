import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { shopPageAbsoluteUrl } from '@/lib/site/shop-url'
import type { PoloEvent, EducationArticle } from '@/types'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fairfieldpolo.com'

const EVENTS_SLUGS_QUERY = `*[_type == "event"]{ "slug": slug.current, date }`
const ARTICLES_SLUGS_QUERY = `*[_type == "educationArticle"]{ "slug": slug.current, publishedAt }`

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [events, articles] = await Promise.all([
    sanityFetch<Pick<PoloEvent, 'slug' | 'date'>[]>(EVENTS_SLUGS_QUERY),
    sanityFetch<Pick<EducationArticle, 'slug' | 'publishedAt'>[]>(ARTICLES_SLUGS_QUERY),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,           lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/schedule`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/schedule/calendar`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/schedule/results`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.75 },
    { url: `${BASE_URL}/club`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/club/membership`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/club/join`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/club/members`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/club/visit`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/club/map`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/club/history`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/venue`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/venue/weddings`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/venue/private-events`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/venue/corporate`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/venue/pavilion`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: `${BASE_URL}/venue/gallery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/venue/contact`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.75 },
    { url: shopPageAbsoluteUrl('/shop'),          lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: shopPageAbsoluteUrl('/store/cart'),     lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.4 },
    { url: shopPageAbsoluteUrl('/store/checkout'), lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/learn`,      lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/learn/rules`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/learn/equipment`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/learn/glossary`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/learn/watch`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/learn/what-is-polo`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/learn/beginner`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/learn/lessons`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.65 },
    { url: `${BASE_URL}/wichita-polo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/polo-lessons-wichita`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/wichita-events-polo`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${BASE_URL}/wichita-event-venue`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ]

  const eventRoutes: MetadataRoute.Sitemap = events.map(e => ({
    url:             `${BASE_URL}/events/${e.slug.current}`,
    lastModified:    new Date(e.date),
    changeFrequency: 'weekly' as const,
    priority:        0.8,
  }))

  const articleRoutes: MetadataRoute.Sitemap = articles.map(a => ({
    url:             `${BASE_URL}/learn/${a.slug.current}`,
    lastModified:    new Date(a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority:        0.6,
  }))

  return [...staticRoutes, ...eventRoutes, ...articleRoutes]
}
