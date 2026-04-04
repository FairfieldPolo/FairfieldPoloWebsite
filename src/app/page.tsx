import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import {
  FEATURED_EVENTS_QUERY,
  ACTIVE_ANNOUNCEMENTS_QUERY,
  SPONSORS_QUERY,
} from '@/lib/queries'
import type { PoloEvent, Announcement, Sponsor } from '@/types'
import { HeroSection }        from '@/components/sections/HeroSection'
import { AnnouncementBanner } from '@/components/sections/AnnouncementBanner'
import { EventsStrip }        from '@/components/sections/EventsStrip'
import { AboutStrip }         from '@/components/sections/AboutStrip'
import { SponsorsSection }    from '@/components/sections/SponsorsSection'
import { NewsletterSection }  from '@/components/sections/NewsletterSection'
import { InstagramSection }   from '@/components/sections/InstagramSection'

export const revalidate = 60 // ISR — rebuild every 60s

export const metadata: Metadata = {
  title: 'Fairfield Polo Club — Live Polo Every Sunday in Haysville, Kansas',
}

export default async function HomePage() {
  const [events, announcements, sponsors] = await Promise.all([
    sanityFetch<PoloEvent[]>(FEATURED_EVENTS_QUERY),
    sanityFetch<Announcement[]>(ACTIVE_ANNOUNCEMENTS_QUERY),
    sanityFetch<Sponsor[]>(SPONSORS_QUERY),
  ])

  const pinnedAnnouncement = announcements.find(a => a.pinned) ?? announcements[0]

  return (
    <>
      {pinnedAnnouncement && (
        <AnnouncementBanner announcement={pinnedAnnouncement} />
      )}
      <HeroSection />
      <EventsStrip events={events} />
      <AboutStrip />
      <InstagramSection />
      <SponsorsSection sponsors={sponsors} />
      <NewsletterSection />
    </>
  )
}
