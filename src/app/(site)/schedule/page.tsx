import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { ALL_UPCOMING_EVENTS_QUERY } from '@/lib/queries'
import type { PoloEvent } from '@/types'
import { PageHero } from '@/components/ui/PageHero'
import { EventCard } from '@/components/ui/EventCard'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { formatEventDate, formatEventTime, EVENT_TYPE_LABELS, EVENT_TYPE_COLORS } from '@/lib/utils'

export const revalidate = 60

export const metadata: Metadata = {
  title: '2025 Season Schedule',
  description: 'Full 2025 polo season schedule for Fairfield Polo Club in Haysville, Kansas. Matches every Sunday at 1pm plus special events.',
}

export default async function SchedulePage() {
  const events = await sanityFetch<PoloEvent[]>(ALL_UPCOMING_EVENTS_QUERY)

  return (
    <>
      <PageHero
        title="2025 Season Schedule"
        subtitle="Every match, tournament, and special event this season. Gates open at noon for Sunday games."
        eyebrow="Season calendar"
      />

      <section className="section-cream section-pad">
        <div className="container-polo">

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-10">
            {Object.entries(EVENT_TYPE_LABELS).map(([type, label]) => (
              <span key={type} className={`badge ${EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS]}`}>
                {label}
              </span>
            ))}
          </div>

          {events.length > 0 ? (
            <>
              {/* List view — clean timeline */}
              <div className="hidden md:block mb-16">
                <div className="divide-y divide-polo-cream-dark border border-polo-cream-dark rounded-sm overflow-hidden bg-white">
                  {events.map((event, i) => (
                    <a
                      key={event._id}
                      href={`/events/${event.slug.current}`}
                      className={`flex items-center gap-6 px-6 py-4 hover:bg-polo-cream/60 transition-colors group ${i === 0 ? 'bg-polo-cream/40' : ''}`}
                    >
                      {/* Date column */}
                      <div className="w-20 flex-shrink-0 text-center">
                        <div className="font-display text-2xl font-bold text-polo-green leading-none">
                          {new Date(event.date).getDate()}
                        </div>
                        <div className="font-body text-xs uppercase text-polo-green/50 tracking-wide">
                          {new Date(event.date).toLocaleString('en-US', { month: 'short' })}
                        </div>
                        <div className="font-body text-xs text-gray-400">
                          {new Date(event.date).toLocaleString('en-US', { weekday: 'short' })}
                        </div>
                      </div>

                      {/* Time */}
                      <div className="w-20 flex-shrink-0">
                        <div className="font-body text-sm font-medium text-polo-charcoal">
                          {formatEventTime(event.date)}
                        </div>
                      </div>

                      {/* Title */}
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-base font-semibold text-polo-green group-hover:text-polo-green-mid transition-colors truncate">
                          {event.title}
                        </div>
                        {(event.shortDescription || event.venue?.label) && (
                          <div className="font-body text-xs text-gray-500 mt-0.5 truncate">
                            {[event.venue?.label, event.shortDescription].filter(Boolean).join(' · ')}
                          </div>
                        )}
                      </div>

                      {/* Type badge */}
                      <span className={`badge flex-shrink-0 ${EVENT_TYPE_COLORS[event.eventType]}`}>
                        {EVENT_TYPE_LABELS[event.eventType]}
                      </span>

                      {/* Admission */}
                      {event.admissionFee && (
                        <div className="w-20 flex-shrink-0 text-right font-body text-sm text-polo-green font-medium">
                          {event.admissionFee}
                        </div>
                      )}

                      {/* Arrow */}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                        className="text-polo-green/30 group-hover:text-polo-green transition-colors flex-shrink-0">
                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile — card grid */}
              <div className="md:hidden grid grid-cols-1 gap-4">
                {events.map(event => (
                  <EventCard key={event._id} event={event} variant="compact" />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-polo-green/30">Season schedule coming soon</p>
              <p className="font-body text-gray-400 mt-2">We play every Sunday at 1pm during the season.</p>
            </div>
          )}

          {/* Season notes */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <h3 className="font-display text-lg text-polo-green font-bold mb-3">Weekly matches</h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">
                Open matches are held every Sunday at 1:00 PM throughout the spring and summer season.
                Gates open at noon. Free admission — no tickets required. Bring chairs, blankets, and the family.
              </p>
            </div>
            <div className="card p-6">
              <h3 className="font-display text-lg text-polo-green font-bold mb-3">Special events</h3>
              <p className="font-body text-sm text-gray-600 leading-relaxed">
                Pink Polo, charity tournaments, and private events are scheduled throughout the season.
                Some events have admission fees. Sign up for our mailing list to get advance notice.
              </p>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  )
}
