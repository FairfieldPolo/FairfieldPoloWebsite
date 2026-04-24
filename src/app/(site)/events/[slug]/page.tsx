import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { EVENT_BY_SLUG_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries'
import { getPublicPoloCopy } from '@/lib/site/publicPolo'
import type { PoloEvent, SiteSettings } from '@/types'
import { WeatherCancellationsNote } from '@/components/ui/WeatherCancellationsNote'
import {
  formatEventDate, formatEventTime,
  EVENT_TYPE_LABELS, EVENT_TYPE_COLORS,
} from '@/lib/utils'
import { eventWhereDisplay } from '@/lib/site/event-location'

export const revalidate = 60

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = await sanityFetch<PoloEvent | null>(EVENT_BY_SLUG_QUERY, { slug })
  if (!event) return { title: 'Event not found' }
  return {
    title: event.title,
    description: event.shortDescription ?? `${event.title} at Fairfield Polo Club`,
    openGraph: {
      images: event.image
        ? [{ url: urlFor(event.image).width(1200).height(630).url() }]
        : [],
    },
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const [event, settings] = await Promise.all([
    sanityFetch<PoloEvent | null>(EVENT_BY_SLUG_QUERY, { slug }),
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
  ])
  if (!event) notFound()

  const polo = getPublicPoloCopy(settings)
  const typeLabel = EVENT_TYPE_LABELS[event.eventType]
  const typeColor = EVENT_TYPE_COLORS[event.eventType]
  const where = eventWhereDisplay(event)

  return (
    <div className="pt-20 bg-polo-cream min-h-screen">
      {/* Hero image */}
      <div className="relative h-64 md:h-96 bg-polo-green overflow-hidden">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(1400).height(600).url()}
            alt={event.image.alt ?? event.title}
            fill
            className="object-cover opacity-70"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-polo-green to-polo-green-mid" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-polo-charcoal/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-polo pb-8">
          <span className={`badge mb-3 ${typeColor}`}>{typeLabel}</span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-polo-cream">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="container-polo py-10">
        <WeatherCancellationsNote
          className="mb-8"
          text={polo.weatherNote}
          facebookUrl={settings?.facebookUrl}
        />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main content */}
          <div className="lg:col-span-2">
            {event.description ? (
              <div className="prose prose-green max-w-none font-body">
                <PortableText value={event.description} />
              </div>
            ) : (
              <p className="font-body text-gray-500 italic">No additional details available.</p>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="card p-5 space-y-4">
              <h2 className="font-display text-lg font-bold text-polo-green">Event details</h2>

              <div className="flex gap-3 items-start">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-polo-green mt-0.5 flex-shrink-0">
                  <rect x="1" y="2" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M6 1v2M12 1v2M1 7h16" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                <div>
                  <div className="font-body font-medium text-polo-charcoal text-sm">{formatEventDate(event.date)}</div>
                  <div className="font-body text-xs text-gray-500">{formatEventTime(event.date)}</div>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-polo-green mt-0.5 flex-shrink-0">
                  <path d="M9 1C6.24 1 4 3.24 4 6c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5z" stroke="currentColor" strokeWidth="1.2"/>
                  <circle cx="9" cy="6" r="2" stroke="currentColor" strokeWidth="1.2"/>
                </svg>
                <div className="min-w-0">
                  <div className="font-body font-medium text-polo-charcoal text-sm">
                    {where.title}
                  </div>
                  {where.lines.map((line, i) => (
                    <div key={`${i}-${line}`} className="font-body text-xs text-gray-500">
                      {line}
                    </div>
                  ))}
                  {where.notes ? (
                    <div className="font-body text-xs text-gray-500 mt-1">{where.notes}</div>
                  ) : null}
                  <a
                    href={where.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex font-body text-xs text-polo-green hover:text-polo-green-light transition-colors mt-1.5"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              {event.admissionFee && (
                <div className="flex gap-3 items-start">
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-polo-green mt-0.5 flex-shrink-0">
                    <circle cx="9" cy="9" r="8" stroke="currentColor" strokeWidth="1.2"/>
                    <path d="M9 5v1M9 12v1M6.5 7.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <div className="font-body font-medium text-polo-charcoal text-sm">Admission</div>
                    <div className="font-body text-xs text-gray-500">{event.admissionFee}</div>
                  </div>
                </div>
              )}

              <div className="pt-2 space-y-2">
                {event.ticketUrl && (
                  <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-gold w-full text-center text-sm">
                    Get tickets
                  </a>
                )}
                <a
                  href={`/api/ical?slug=${event.slug.current}`}
                  className="btn-outline w-full text-center text-sm"
                >
                  Add to calendar
                </a>
                <Link href="/contact#directions" className="block text-center font-body text-sm text-polo-green/60 hover:text-polo-green pt-1">
                  Get directions →
                </Link>
              </div>
            </div>

            {/* Sponsors */}
            {event.sponsors && event.sponsors.length > 0 && (
              <div className="card p-5">
                <h3 className="font-body text-xs uppercase tracking-widest text-gray-400 mb-3">Event sponsors</h3>
                <div className="flex flex-wrap gap-3">
                  {event.sponsors.map(sponsor => (
                    <span key={sponsor._id} className="font-body text-sm text-polo-green font-medium">
                      {sponsor.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        <div className="mt-10 pt-6 border-t border-polo-cream-dark">
          <Link href="/schedule/calendar" className="font-body text-sm text-polo-green/60 hover:text-polo-green transition-colors">
            ← Back to schedule calendar
          </Link>
        </div>
      </div>
    </div>
  )
}
