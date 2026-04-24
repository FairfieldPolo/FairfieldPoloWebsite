import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const metadata: Metadata = {
  title: 'Wichita Event Venue',
  description:
    'Searching for a Wichita-area event venue? Fairfield Polo Club offers a unique outdoor setting in Haysville for private events, parties, and corporate gatherings.',
  keywords: [
    'Wichita event venue',
    'Haysville event venue',
    'Outdoor venue Wichita KS',
    'Corporate event venue Wichita',
    'Wedding venue Wichita area',
  ],
}

export default function WichitaEventVenuePage() {
  return (
    <>
      <PageHero
        title="Wichita-Area Event Venue at Fairfield Polo Club"
        subtitle="Host memorable private events in a unique polo setting just south of Wichita."
        eyebrow="Venue"
      />

      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="card p-7">
              <div className="gold-rule mb-5" />
              <h2 className="heading-section text-polo-green mb-4">Private events and venue inquiries</h2>
              <div className="space-y-4 font-body text-sm text-gray-600 leading-relaxed">
                <p>
                  If you are searching for a <strong>Wichita event venue</strong>, Fairfield Polo Club
                  offers a distinctive open-air backdrop for gatherings in the Wichita metro area.
                </p>
                <p>
                  We may be a fit for private parties, corporate outings, receptions, and other special
                  occasions based on date and season availability.
                </p>
                <p>
                  Tell us about your event goals, estimated guest count, and preferred dates so we can
                  discuss options.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-polo-green rounded-sm p-6">
                <h3 className="font-display text-xl text-polo-gold font-semibold mb-3">Venue inquiry checklist</h3>
                <ul className="space-y-2 font-body text-sm text-polo-cream/85">
                  <li>Event type and desired date</li>
                  <li>Estimated guest count</li>
                  <li>Any vendor or setup requirements</li>
                </ul>
              </div>

              <div className="card p-6 space-y-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center font-body text-sm font-medium text-polo-green hover:text-polo-green-light transition-colors"
                >
                  Contact us about venue availability →
                </Link>
                <Link
                  href="/schedule"
                  className="inline-flex items-center font-body text-sm font-medium text-polo-green hover:text-polo-green-light transition-colors"
                >
                  See examples of polo event days →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  )
}
