import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'

import { PoloFieldSilhouette } from '@/components/ui/PoloFieldSilhouette'

export const metadata: Metadata = {
  title: 'How to Watch Polo at Fairfield',
  description:
    'What to wear, where to sit, tailgating, family fun, and safety—your relaxed guide to a day at Fairfield Polo Club.',
}

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-polo-gold/50 bg-polo-gold/10 text-polo-gold"
      aria-hidden
    >
      {children}
    </div>
  )
}

function WatchSection({
  id,
  title,
  icon,
  children,
}: {
  id: string
  title: string
  icon: ReactNode
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="mb-4 flex items-start gap-4">
        {icon}
        <h2 className="font-display text-2xl md:text-3xl text-polo-green font-bold leading-tight pt-1">
          {title}
        </h2>
      </div>
      <div className="pl-0 sm:pl-14 space-y-3">{children}</div>
    </section>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-none space-y-2.5 font-body text-gray-600 text-sm md:text-base">
      {items.map((t) => (
        <li key={t} className="flex gap-3 pl-0">
          <span className="text-polo-gold/90 flex-shrink-0" aria-hidden>
            ·
          </span>
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  )
}

export default function HowToWatchPage() {
  return (
    <>
      <header className="relative min-h-[44vh] md:min-h-[48vh] flex flex-col justify-end overflow-hidden">
        <div className="absolute inset-0 bg-polo-green" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-polo-green via-polo-green/98 to-polo-brown/25"
          aria-hidden
        />
        {/* Warmer, sunlit feel — suggest a crowd or tailgate; swap for /public/images/... when you have a photo */}
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_0%,rgba(201,168,76,0.18),transparent_55%)]"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_100%,rgba(232,201,122,0.08),transparent_45%)]"
          aria-hidden
        />
        <PoloFieldSilhouette className="absolute -right-2 bottom-0 w-[min(100%,30rem)] opacity-[0.08] text-polo-cream pointer-events-none" />

        <div className="relative z-10 container-polo pt-32 pb-14 md:pb-20">
          <Link
            href="/learn"
            className="mb-5 inline-flex items-center gap-1 font-body text-sm text-polo-cream/70 hover:text-polo-gold transition-colors"
          >
            <span aria-hidden>←</span> Learn polo
          </Link>
          <h1 className="heading-display text-polo-cream max-w-3xl drop-shadow-sm">
            How to Watch Polo at Fairfield
          </h1>
          <p className="mt-5 max-w-xl font-body text-xl md:text-2xl text-polo-cream/90 font-medium leading-snug">
            Come as you are. Stay for the experience.
          </p>
        </div>
      </header>

      <article className="section-cream section-pad border-t border-polo-cream-dark/50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-12 md:space-y-16">
          {/* Welcome */}
          <div className="text-center sm:text-left">
            <h2 className="sr-only">Welcome</h2>
            <p className="font-body text-lg text-polo-green/95 leading-relaxed">
              We love this sport—and we love sharing it.
            </p>
            <p className="mt-4 font-body text-gray-600 leading-relaxed">
              Whether it&apos;s your first match or your tenth, you&apos;re welcome here. Polo is
              as much about the atmosphere as it is the game, and spectators are a big part of
              that.
            </p>
            <p className="mt-3 font-body text-gray-600 leading-relaxed">
              Come out, relax, and enjoy it your way.
            </p>
            <figure className="mt-8 rounded-sm border border-polo-gold/30 bg-white/60 px-6 py-5 text-center shadow-sm">
              <blockquote className="font-display text-xl md:text-2xl text-polo-green italic">
                “Come as you are. Enjoy the day.”
              </blockquote>
            </figure>
          </div>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          <WatchSection
            id="what-to-wear"
            title="What to wear"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4 4h4l1 2h6l1-2h4v3l-1 1v12H5V8L4 7V4z" strokeLinejoin="round" />
                </svg>
              </SectionIcon>
            }
          >
            <BulletList
              items={[
                "Come as you're comfortable",
                'Some guests like to dress up, especially on Sundays',
                'As a tradition, players wear white pants on Sundays',
                "You'll also see plenty of jeans and casual wear",
                "There's no dress code—just be comfortable",
              ]}
            />
          </WatchSection>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          <WatchSection
            id="where-to-watch"
            title="Where to watch"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M3 10h2l1-2h4l1 2h2M5 10v7h2v-4h1v4h1v-4h2v4h1v-4h1v4h1v-4h1v4h1v-7" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 20h19" />
                </svg>
              </SectionIcon>
            }
          >
            <BulletList
              items={[
                'Watch from your tailgate setup along the sidelines',
                'Bring chairs, blankets, or whatever makes you comfortable',
                "You're also welcome at the pavilion to sit and socialize",
                'Move around, explore, and find your favorite view',
              ]}
            />
          </WatchSection>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          <WatchSection
            id="tailgating"
            title="Tailgating encouraged"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <rect x="3" y="8" width="18" height="6" rx="1" />
                  <path d="M7 8V6a2 2 0 0 1 2-2h1M14 4h1a2 2 0 0 1 2 2v2" strokeLinecap="round" />
                  <path d="M3 20h2l1-3h12l1 3h2" strokeLinecap="round" />
                </svg>
              </SectionIcon>
            }
          >
            <BulletList
              items={[
                'Bring food and beverages',
                'Set up and enjoy the day with friends and family',
                'Polo is a social sport—make it your own experience',
              ]}
            />
          </WatchSection>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          <WatchSection
            id="family"
            title="Family friendly"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM4 20v-2a2 2 0 0 1 2-2h2M16 3a2 2 0 0 0 0 4 2 2 0 0 0 0-4zM8 20v-2M16 3v0M20 20v-2a2 2 0 0 0-2-2h-1" />
                </svg>
              </SectionIcon>
            }
          >
            <BulletList
              items={[
                'Families are always welcome',
                'Kids can enjoy the open space and atmosphere',
                "It's a relaxed environment—come spend the day together",
              ]}
            />
          </WatchSection>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          <WatchSection
            id="pets"
            title="Pets & animals"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M4 14c-1-2 0-3 0-3s1 1 2 3M8 7s1-2 1-3 1-2 1-1M16 3s1-1 1 1-1 3-1 3M20 11s1 1 0 3M12 4s2 2 2 3v2M6 20s1-1 1-2 0-1 1-1M18 20s-1-1-1-2 0-1-1-1" />
                  <path d="M7 20h10" />
                </svg>
              </SectionIcon>
            }
          >
            <BulletList
              items={[
                'Animals are welcome',
                'Must be on a leash or otherwise secured—for their safety, others, and the players',
              ]}
            />
          </WatchSection>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          {/* Safety callout */}
          <section
            className="rounded-sm border-2 border-polo-gold/45 bg-gradient-to-br from-amber-50/95 via-polo-cream/90 to-polo-cream p-6 md:p-8 shadow-md ring-1 ring-polo-gold/20 scroll-mt-24"
            id="safety"
            role="region"
            aria-labelledby="safety-heading"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
              <div
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-polo-gold/20 text-polo-brown"
                aria-hidden
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v2M4 4l2 2M20 4l-2 2M8 4h4M8 4v2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V4" strokeLinecap="round" />
                  <path d="M8 20h8a2 2 0 0 0 2-2V10H6v8a2 2 0 0 0 2 2z" />
                </svg>
              </div>
              <div>
                <h2 id="safety-heading" className="font-display text-2xl text-polo-green font-bold">
                  Safety notes
                </h2>
                <p className="mt-1 font-body text-sm text-polo-green/80">
                  A few habits that keep everyone—two-legged and four—having a good day.
                </p>
                <ul className="mt-4 list-none space-y-2.5 font-body text-gray-700 text-sm md:text-base">
                  {[
                    'Stay alert—balls can come toward the sidelines',
                    'Pay attention during active play',
                    'Give horses and players space',
                    'Be aware of your surroundings at all times',
                  ].map((t) => (
                    <li key={t} className="flex gap-2">
                      <span className="text-polo-brown font-bold" aria-hidden>
                        →
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          <WatchSection
            id="community"
            title="Don't be a stranger"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path d="M8 9h.01M12 9h.01M16 9h.01M3 20c0-2 1.5-4 3.5-4.5A6 6 0 0 1 3 8a6 6 0 0 1 9-4.5A6 6 0 0 1 21 8c0 2.2-1.2 4.1-3 5.2l1 1.2M15 20h-2" strokeLinecap="round" />
                </svg>
              </SectionIcon>
            }
          >
            <BulletList
              items={[
                'Ask questions—we love sharing the sport',
                'Talk to players, members, and other spectators',
                'The community is part of what makes polo special',
              ]}
            />
          </WatchSection>

          <div className="h-px bg-polo-cream-dark/50" role="separator" aria-hidden />

          <div className="text-center sm:text-left rounded-sm bg-polo-green/5 border border-polo-green/10 px-6 py-8 md:py-10">
            <h2 className="font-display text-2xl md:text-3xl text-polo-green font-bold mb-4">
              The spirit of it all
            </h2>
            <p className="font-body text-gray-600 leading-relaxed text-base md:text-lg max-w-prose mx-auto sm:mx-0">
              We play because we love the sport—and we love having people there to experience it
              with us.
            </p>
            <p className="mt-4 font-body text-polo-green/90 font-medium text-base md:text-lg max-w-prose mx-auto sm:mx-0">
              However you choose to enjoy the day, you&apos;re part of it.
            </p>
          </div>
        </div>
      </article>
    </>
  )
}
