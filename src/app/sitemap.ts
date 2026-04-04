import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/lib/sanity'
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
    { url: `${BASE_URL}/events`,   lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE_URL}/schedule`, lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/store`,    lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${BASE_URL}/learn`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/about`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
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
