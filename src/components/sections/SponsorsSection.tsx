import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import { SPONSOR_TIER_LABELS } from '@/lib/utils'
import type { Sponsor, SponsorTier } from '@/types'

const TIER_SIZES: Record<SponsorTier, { container: string; img: number }> = {
  title:      { container: 'h-20', img: 180 },
  gold:       { container: 'h-14', img: 140 },
  silver:     { container: 'h-12', img: 120 },
  supporting: { container: 'h-10', img: 100 },
}

export function SponsorsSection({ sponsors }: { sponsors: Sponsor[] }) {
  if (sponsors.length === 0) return null

  const tiers: SponsorTier[] = ['title', 'gold', 'silver', 'supporting']
  const byCourse = tiers.map(tier => ({
    tier,
    sponsors: sponsors.filter(s => s.tier === tier),
  })).filter(t => t.sponsors.length > 0)

  return (
    <section className="bg-white section-pad-sm border-t border-polo-cream-dark">
      <div className="container-polo">
        <div className="text-center mb-10">
          <div className="gold-rule mx-auto mb-4" />
          <h2 className="heading-section text-polo-green">Our Sponsors</h2>
          <p className="font-body text-gray-500 mt-2">
            Proudly supported by these outstanding partners
          </p>
        </div>

        <div className="space-y-10">
          {byCourse.map(({ tier, sponsors: tierSponsors }) => {
            const sizes = TIER_SIZES[tier]
            return (
              <div key={tier}>
                <div className="divider-text mb-6 font-body text-xs uppercase tracking-widest">
                  {SPONSOR_TIER_LABELS[tier]}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-8">
                  {tierSponsors.map(sponsor => (
                    <a
                      key={sponsor._id}
                      href={sponsor.website ?? '#'}
                      target={sponsor.website ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className={`
                        ${sizes.container} flex items-center
                        opacity-70 hover:opacity-100 transition-opacity duration-200
                        grayscale hover:grayscale-0 transition-all
                      `}
                      aria-label={sponsor.name}
                    >
                      {sponsor.logo ? (
                        <Image
                          src={urlFor(sponsor.logo).height(80).url()}
                          alt={sponsor.name}
                          width={sizes.img}
                          height={80}
                          className="object-contain h-full w-auto"
                        />
                      ) : (
                        <span className="font-display font-bold text-polo-green/60 text-lg">
                          {sponsor.name}
                        </span>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <a
            href="/contact"
            className="font-body text-sm text-polo-green/60 hover:text-polo-green transition-colors underline-offset-4 hover:underline"
          >
            Interested in sponsorship opportunities? Get in touch →
          </a>
        </div>
      </div>
    </section>
  )
}
