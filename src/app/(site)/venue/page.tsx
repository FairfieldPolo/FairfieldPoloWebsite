import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const metadata: Metadata = {
  title: 'Venue',
  description:
    'Premium Wichita-area venue at Fairfield Polo Club for weddings, private parties, corporate events, and photo shoots.',
  keywords: [
    'Wichita event venue',
    'Wichita wedding venue',
    'Corporate event venue Wichita',
    'Pavilion rental Wichita',
  ],
}

const VENUE_LINKS = [
  { label: 'Weddings', href: '/venue/weddings' },
  { label: 'Private Events', href: '/venue/private-events' },
  { label: 'Corporate Events', href: '/venue/corporate' },
  { label: 'Pavilion Rental', href: '/venue/pavilion' },
  { label: 'Gallery', href: '/venue/gallery' },
  { label: 'Venue Contact', href: '/venue/contact' },
]

export default function VenuePage() {
  return (
    <>
      <PageHero
        title="Venue"
        subtitle="Host weddings, private gatherings, and corporate events in a distinctive polo setting."
        eyebrow="Fairfield Venue"
      />
      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card p-7">
              <div className="gold-rule mb-5" />
              <h2 className="heading-section text-polo-green mb-4">A premium rural-luxury setting</h2>
              <p className="font-body text-sm text-gray-600 leading-relaxed">
                Fairfield Polo Club blends wide-open Kansas landscapes with refined sporting-club character.
                Ideal for memorable celebrations, client experiences, and private events.
              </p>
            </div>
            <div className="card p-7">
              <h3 className="heading-card text-polo-green mb-4">Venue pages</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {VENUE_LINKS.map((link) => (
                  <Link key={link.href} href={link.href} className="btn-outline text-center">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <NewsletterSection />
    </>
  )
}
