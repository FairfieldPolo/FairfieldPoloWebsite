import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import {
  FEATURED_EVENTS_QUERY,
  ACTIVE_ANNOUNCEMENTS_QUERY,
  SPONSORS_QUERY,
  SITE_SETTINGS_QUERY,
} from '@/lib/queries'
import { getPublicPoloCopy } from '@/lib/site/publicPolo'
import {
  type ResolvedClubLocation,
  displayAddressFromResolved,
  resolvePrimaryLocation,
} from '@/lib/site/location'
import type { PoloEvent, Announcement, Sponsor, SiteSettings } from '@/types'
import { HeroSection }        from '@/components/sections/HeroSection'
import { AnnouncementBanner } from '@/components/sections/AnnouncementBanner'
import { EventsStrip }        from '@/components/sections/EventsStrip'
import { AboutStrip }         from '@/components/sections/AboutStrip'
import { SponsorsSection }    from '@/components/sections/SponsorsSection'
import { NewsletterSection }  from '@/components/sections/NewsletterSection'
import { InstagramSection }   from '@/components/sections/InstagramSection'

export const revalidate = 60 // ISR — rebuild every 60s

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  const polo = getPublicPoloCopy(settings)
  return {
    title: 'Fairfield Polo Club — Live Polo in Haysville, Kansas',
    description: `Fairfield Polo Club, founded 1931. ${polo.seoSchedule} Open to the public in Haysville, Kansas.`,
  }
}

export default async function HomePage() {
  const [events, announcements, sponsors, settings] = await Promise.all([
    sanityFetch<PoloEvent[]>(FEATURED_EVENTS_QUERY),
    sanityFetch<Announcement[]>(ACTIVE_ANNOUNCEMENTS_QUERY),
    sanityFetch<Sponsor[]>(SPONSORS_QUERY),
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
  ])

  const polo = getPublicPoloCopy(settings)
  /** Resolved for maps + display; not a raw `ClubLocation` (no `mapsQuery` on CMS rows). */
  const primary: ResolvedClubLocation = resolvePrimaryLocation(settings)
  const heroAddressLine = primary.line2
    ? `${primary.line1}, ${primary.line2.split(',')[0].trim()}`
    : primary.line1
  const eventsStripAddress = displayAddressFromResolved(primary)

  const pinnedAnnouncement = announcements.find(a => a.pinned) ?? announcements[0]

  return (
    <>
      {pinnedAnnouncement && (
        <AnnouncementBanner announcement={pinnedAnnouncement} />
      )}
      <HeroSection polo={polo} addressLine={heroAddressLine} />
      <EventsStrip
        events={events}
        polo={polo}
        fullAddress={eventsStripAddress}
        facebookUrl={settings?.facebookUrl}
      />
      <AboutStrip polo={polo} />
      <InstagramSection />
      <SponsorsSection sponsors={sponsors} />
      <NewsletterSection />
    </>
  )
}
