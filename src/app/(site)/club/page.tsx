import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const metadata: Metadata = {
  title: 'Club',
  description:
    'Explore Fairfield Polo Club membership, visitor information, directions, club history, and member resources.',
}

const CLUB_LINKS = [
  { label: 'Membership Levels', href: '/club/membership' },
  { label: 'Join the Club', href: '/club/join' },
  { label: 'Members Portal', href: '/club/members' },
  { label: 'Visitor Information', href: '/club/visit' },
  { label: 'Property Map', href: '/club/map' },
  { label: 'Club History', href: '/club/history' },
]

export default function ClubPage() {
  return (
    <>
      <PageHero
        title="Club"
        subtitle="Membership, community, and visitor guidance at Fairfield Polo Club."
        eyebrow="Fairfield Polo Club"
      />
      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="card p-7">
            <div className="gold-rule mb-6" />
            <h2 className="heading-section text-polo-green mb-4">Club resources</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CLUB_LINKS.map((link) => (
                <Link key={link.href} href={link.href} className="btn-outline text-center">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      <NewsletterSection />
    </>
  )
}
