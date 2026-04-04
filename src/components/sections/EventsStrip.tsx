import Link from 'next/link'
import { EventCard } from '@/components/ui/EventCard'
import type { PoloEvent } from '@/types'

export function EventsStrip({ events }: { events: PoloEvent[] }) {
  return (
    <section className="section-cream section-pad">
      <div className="container-polo">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="gold-rule mb-4" />
            <h2 className="heading-section text-polo-green">
              Upcoming Events
            </h2>
            <p className="font-body text-gray-500 mt-2 max-w-lg">
              Open to the public every Sunday at 1&nbsp;pm. Special events throughout the season.
            </p>
          </div>
          <Link
            href="/events"
            className="hidden sm:inline-flex btn-outline text-sm py-2 px-5"
          >
            Full schedule
          </Link>
        </div>

        {/* Event cards grid */}
        {events.length > 0 ? (
          <>
            {/* First event featured, rest default */}
            {events.length === 1 ? (
              <div className="max-w-md">
                <EventCard event={events[0]} variant="featured" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {events.map((event, i) => (
                  <EventCard
                    key={event._id}
                    event={event}
                    variant={i === 0 ? 'featured' : 'default'}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16 bg-white rounded-sm border border-polo-cream-dark">
            <div className="font-display text-3xl text-polo-green/20 mb-3">No upcoming events</div>
            <p className="font-body text-gray-500">
              Check back soon — we play every Sunday at 1&nbsp;pm.
            </p>
          </div>
        )}

        {/* Mobile full schedule link */}
        <div className="mt-8 text-center sm:hidden">
          <Link href="/events" className="btn-outline w-full">
            See full schedule
          </Link>
        </div>

        {/* Sunday callout strip */}
        <div className="mt-12 bg-polo-green rounded-sm p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-body text-polo-gold text-xs uppercase tracking-widest mb-2">
              Every week
            </div>
            <h3 className="font-display text-xl md:text-2xl font-bold text-polo-cream">
              Sundays at 1:00 PM — Free Admission
            </h3>
            <p className="font-body text-polo-cream/70 text-sm mt-1">
              9420 South Broadway Ave, Haysville, Kansas · Gates open at noon
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link href="/contact#directions" className="btn-outline border-polo-cream/40 text-polo-cream hover:bg-polo-cream hover:text-polo-green text-sm py-2.5">
              Directions
            </Link>
            <Link href="/contact#newsletter" className="btn-gold text-sm py-2.5">
              Get Alerts
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
