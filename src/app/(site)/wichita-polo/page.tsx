import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const metadata: Metadata = {
  title: 'Wichita Polo at Fairfield Polo Club',
  description:
    'Looking for Wichita polo? Fairfield Polo Club, just south of Wichita in Haysville, hosts public matches, polo lessons, and seasonal polo events.',
  keywords: [
    'Wichita polo',
    'Wichita polo club',
    'Polo club Wichita KS',
    'Polo Wichita KS',
    'Watch polo Wichita',
    'Polo lessons Wichita',
  ],
}

export default function WichitaPoloPage() {
  return (
    <>
      <PageHero
        title="Wichita Polo at Fairfield Polo Club"
        subtitle="The Wichita area's long-running polo club for matches, lessons, and special events."
        eyebrow="Wichita Polo"
      />

      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 card p-7">
              <div className="gold-rule mb-5" />
              <h2 className="heading-section text-polo-green mb-4">
                Looking for polo in Wichita, Kansas?
              </h2>
              <div className="space-y-4 font-body text-sm text-gray-600 leading-relaxed">
                <p>
                  Fairfield Polo Club is located in Haysville, just south of Wichita, and has been
                  serving the local polo community for generations. If you searched for
                  {' '}<strong>Wichita polo club</strong>{' '}, you are in the right place.
                </p>
                <p>
                  We welcome first-time spectators, families, and longtime fans who want to watch
                  fast, competitive outdoor polo in a friendly setting.
                </p>
                <p>
                  Public match days are open to the community, and we also offer pathways for new
                  players to learn more about the sport.
                </p>
              </div>
            </div>

            <aside className="space-y-5">
              <div className="bg-polo-green rounded-sm p-6">
                <h3 className="font-display text-xl text-polo-gold font-semibold mb-3">
                  Wichita polo quick links
                </h3>
                <ul className="space-y-2 font-body text-sm text-polo-cream/85">
                  <li>
                    <Link href="/schedule" className="hover:text-polo-gold transition-colors">
                      Upcoming matches and events →
                    </Link>
                  </li>
                  <li>
                    <Link href="/learn/lessons" className="hover:text-polo-gold transition-colors">
                      Polo lessons in Wichita area →
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-polo-gold transition-colors">
                      Contact and directions →
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="card p-6">
                <h3 className="font-body text-xs uppercase tracking-widest text-gray-400 mb-3">
                  Fairfield Polo Club
                </h3>
                <p className="font-body text-sm text-gray-600">
                  9420 S Broadway Ave
                  <br />
                  Haysville, KS 67060
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  )
}
