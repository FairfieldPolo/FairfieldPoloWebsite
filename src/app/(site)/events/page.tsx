import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import {
  ALL_UPCOMING_EVENTS_QUERY,
  PAST_EVENTS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/lib/queries'
import { getPublicPoloCopy } from '@/lib/site/publicPolo'
import type { PoloEvent, SiteSettings } from '@/types'
import { EventCard } from '@/components/ui/EventCard'
import { PageHero } from '@/components/ui/PageHero'
import { WeatherCancellationsNote } from '@/components/ui/WeatherCancellationsNote'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { formatMonthYear } from '@/lib/utils'

export const revalidate = 60

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  const polo = getPublicPoloCopy(settings)
  return {
    title: 'Events & Schedule',
    description:
      'Upcoming polo matches, tournaments, and charity events at Fairfield Polo Club in Haysville, Kansas. ' +
      polo.seoSchedule,
  }
}

export default async function EventsPage() {
  const [upcoming, past, settings] = await Promise.all([
    sanityFetch<PoloEvent[]>(ALL_UPCOMING_EVENTS_QUERY),
    sanityFetch<PoloEvent[]>(PAST_EVENTS_QUERY),
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
  ])
  const polo = getPublicPoloCopy(settings)

  // Group upcoming by month
  const byMonth = upcoming.reduce<Record<string, PoloEvent[]>>((acc, event) => {
    const key = formatMonthYear(event.date)
    if (!acc[key]) acc[key] = []
    acc[key].push(event)
    return acc
  }, {})

  return (
    <>
      <PageHero
        title="Events & Schedule"
        subtitle={polo.pageHeroEventsSubtitle}
        eyebrow="2025 Season"
      />

      <section className="section-cream section-pad">
        <div className="container-polo">
          <WeatherCancellationsNote
            className="mb-10"
            text={polo.weatherNote}
            facebookUrl={settings?.facebookUrl}
          />

          {Object.keys(byMonth).length > 0 ? (
            <div className="space-y-14">
              {Object.entries(byMonth).map(([month, events]) => (
                <div key={month}>
                  <div className="flex items-center gap-4 mb-6">
                    <h2 className="font-display text-2xl font-bold text-polo-green">{month}</h2>
                    <div className="flex-1 h-px bg-polo-cream-dark" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {events.map(event => (
                      <EventCard key={event._id} event={event} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="font-display text-2xl text-polo-green/30">No upcoming events scheduled</p>
              <p className="font-body text-gray-400 mt-2">
                {polo.emptyEvents}
              </p>
            </div>
          )}

          {/* Past events */}
          {past.length > 0 && (
            <div className="mt-20 pt-12 border-t border-polo-cream-dark">
              <h2 className="font-display text-2xl font-bold text-polo-green mb-6">Past Events</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {past.map(event => (
                  <EventCard key={event._id} event={event} variant="compact" />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <NewsletterSection />
    </>
  )
}
