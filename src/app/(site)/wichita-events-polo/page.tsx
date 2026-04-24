import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const metadata: Metadata = {
  title: 'Wichita Polo Events',
  description:
    'Discover upcoming Wichita-area polo events at Fairfield Polo Club in Haysville, KS, including public matches and seasonal tournaments.',
  keywords: [
    'Wichita polo events',
    'Watch polo Wichita',
    'Wichita events polo',
    'Polo events Wichita KS',
  ],
}

export default function WichitaEventsPoloPage() {
  return (
    <>
      <PageHero
        title="Wichita-Area Polo Events"
        subtitle="Plan a day at Fairfield Polo Club for public polo matches, tournaments, and seasonal events."
        eyebrow="Events"
      />

      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-7">
              <div className="gold-rule mb-5" />
              <h2 className="heading-section text-polo-green mb-4">
                Looking for unique events near Wichita?
              </h2>
              <div className="space-y-4 font-body text-sm text-gray-600 leading-relaxed">
                <p>
                  Fairfield Polo Club hosts memorable outdoor polo experiences just south of Wichita.
                  Match days can include competitive polo, family-friendly atmosphere, and classic
                  Kansas evenings on the field.
                </p>
                <p>
                  Whether you are local or visiting the area, our seasonal calendar is the best way
                  to find upcoming public polo events and special dates.
                </p>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="bg-polo-green rounded-sm p-6">
                <h3 className="font-display text-xl text-polo-gold font-semibold mb-3">Plan your visit</h3>
                <ul className="space-y-2 font-body text-sm text-polo-cream/85">
                  <li>Public events are typically free to attend.</li>
                  <li>Bring lawn chairs or blankets.</li>
                  <li>Check weather updates before traveling.</li>
                </ul>
              </div>

              <div className="card p-6 space-y-3">
                <Link
                  href="/schedule"
                  className="inline-flex items-center font-body text-sm font-medium text-polo-green hover:text-polo-green-light transition-colors"
                >
                  View upcoming polo events →
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center font-body text-sm font-medium text-polo-green hover:text-polo-green-light transition-colors"
                >
                  Get directions from Wichita →
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  )
}
