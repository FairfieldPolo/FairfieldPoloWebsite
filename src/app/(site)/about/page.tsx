import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { SPONSORS_QUERY, SITE_SETTINGS_QUERY } from '@/lib/queries'
import { getPublicPoloCopy } from '@/lib/site/publicPolo'
import type { Sponsor, SiteSettings } from '@/types'
import { PageHero } from '@/components/ui/PageHero'
import { SponsorsSection } from '@/components/sections/SponsorsSection'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'About the Club',
  description: 'Fairfield Polo Club was founded in 1931 and is one of the oldest continuously operating USPA polo clubs in the United States, located in Haysville, Kansas.',
}

export default async function AboutPage() {
  const [sponsors, settings] = await Promise.all([
    sanityFetch<Sponsor[]>(SPONSORS_QUERY),
    sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY),
  ])
  const polo = getPublicPoloCopy(settings)

  return (
    <>
      <PageHero
        title="About Fairfield Polo Club"
        subtitle="Over 90 years of polo on the Kansas plains."
        eyebrow="Est. 1931"
      />

      {/* History */}
      <section className="section-cream section-pad" id="history">
        <div className="container-polo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="gold-rule mb-6" />
              <h2 className="heading-section text-polo-green mb-6">Our history</h2>
              <div className="space-y-4 font-body text-gray-600 leading-relaxed">
                <p>
                  Fairfield Polo Club was established in 1931, making it one of the longest-running
                  USPA-affiliated polo clubs in the country. For over nine decades, the club has been
                  the heartbeat of polo in the Great Plains region.
                </p>
                <p>
                  Located at 9420 South Broadway Avenue in Haysville, Kansas — just south of Wichita —
                  the club sits on the wide, flat plains that make ideal polo terrain. The ground is
                  fast, the sight lines are long, and the Kansas sky is enormous overhead.
                </p>
                <p>
                  The club hosts matches throughout the spring and summer season, including the beloved
                  Pink Polo charity event and various USPA-sanctioned tournaments that draw players
                  from across the region and beyond.
                </p>
                <p>
                  Whether you're a seasoned player or watching polo for the first time, you'll find
                  a warm welcome here. This is the Midwest — we keep things friendly and open.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              {/* USPA card */}
              <div className="bg-polo-green rounded-sm p-6" id="uspa">
                <div className="font-body text-polo-gold text-xs uppercase tracking-widest mb-2">
                  Official affiliation
                </div>
                <h3 className="font-display text-xl text-polo-cream font-bold mb-3">
                  USPA Member Club
                </h3>
                <p className="font-body text-sm text-polo-cream/75 leading-relaxed mb-4">
                  Fairfield Polo Club is a proud member of the United States Polo Association,
                  the national governing body for the sport of polo in the United States since 1890.
                  USPA membership ensures our events are sanctioned, our handicaps are official,
                  and our players compete under standardized rules.
                </p>
                <a
                  href="https://uspolo.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-polo-gold hover:text-polo-gold-light transition-colors"
                >
                  Learn more about USPA →
                </a>
              </div>

              {/* Fast facts */}
              <div className="card p-6">
                <h3 className="font-body text-xs uppercase tracking-widest text-gray-400 mb-4">
                  Fast facts
                </h3>
                <dl className="space-y-3">
                  {[
                    { label: 'Founded',       value: '1931' },
                    { label: 'Location',      value: 'Haysville, Kansas (south of Wichita)' },
                    { label: 'Field address', value: '9420 S Broadway Ave, Haysville, KS 67060' },
                    { label: 'Public games',  value: polo.timeDetail },
                    { label: 'Admission',     value: 'Free — open to the public' },
                    { label: 'Affiliation',   value: 'United States Polo Association (USPA)' },
                    { label: 'Contact',       value: 'wichitapoloclub@gmail.com' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex gap-4">
                      <dt className="font-body text-sm text-gray-400 w-28 flex-shrink-0">{label}</dt>
                      <dd className="font-body text-sm text-polo-charcoal font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Get involved */}
      <section className="bg-polo-cream-dark section-pad">
        <div className="container-polo">
          <div className="text-center mb-12">
            <div className="gold-rule mx-auto mb-4" />
            <h2 className="heading-section text-polo-green">Get involved</h2>
            <p className="font-body text-gray-500 mt-2 max-w-xl mx-auto">
              There's a place for everyone at Fairfield Polo — player, volunteer, or fan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Watch polo',
                icon: '◎',
                body: polo.getInvolved,
                cta: 'See the schedule',
                href: '/events',
              },
              {
                title: 'Learn to play',
                icon: '⊕',
                body: 'Interested in riding or playing? We offer introductory lessons and can connect you with experienced players and horses.',
                cta: 'Contact us',
                href: '/contact',
              },
              {
                title: 'Club membership',
                icon: '✦',
                body: 'Full, student, social, and spectator memberships available. Members enjoy exclusive benefits, event access, and community.',
                cta: 'Learn about membership',
                href: '/membership',
              },
            ].map(({ title, icon, body, cta, href }) => (
              <div key={title} className="card p-6 flex flex-col">
                <div className="font-display text-3xl text-polo-gold mb-4">{icon}</div>
                <h3 className="heading-card text-polo-green mb-3">{title}</h3>
                <p className="font-body text-sm text-gray-600 leading-relaxed flex-1 mb-4">{body}</p>
                <a href={href} className="font-body text-sm font-medium text-polo-green hover:text-polo-green-light transition-colors">
                  {cta} →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SponsorsSection sponsors={sponsors} />
      <NewsletterSection />
    </>
  )
}
