import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { PoloFieldSilhouette } from '@/components/ui/PoloFieldSilhouette'

export const metadata: Metadata = {
  title: 'Polo Rules: A Quick Guide',
  description:
    'A quick-start guide to polo for first-time spectators: objectives, chukkers, right of way, and what to watch for at the field.',
}

function SectionIcon({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-polo-gold/40 bg-polo-gold/5 text-polo-gold"
      aria-hidden
    >
      {children}
    </div>
  )
}

export default function LearnRulesPage() {
  return (
    <>
      {/* Hero: gold radial accent + field silhouette; add /public/images/polo-hero.jpg + Image if you want a photo cover */}
      <header className="relative overflow-hidden min-h-[42vh] md:min-h-[46vh] flex flex-col justify-end">
        <div
          className="absolute inset-0 bg-polo-green"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-polo-green via-polo-green/95 to-polo-green-mid/90 opacity-100"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_100%_0%,rgba(201,168,76,0.12),transparent_50%)]"
          aria-hidden
        />
        <PoloFieldSilhouette className="absolute -right-4 bottom-0 w-[min(100%,32rem)] opacity-[0.07] text-polo-cream pointer-events-none" />

        <div className="relative z-10 container-polo pt-32 pb-12 md:pb-16">
          <Link
            href="/learn"
            className="mb-5 inline-flex items-center gap-1 font-body text-sm text-polo-cream/70 hover:text-polo-gold transition-colors"
          >
            <span aria-hidden>←</span> Learn polo
          </Link>
          <h1 className="heading-display text-polo-cream max-w-3xl">
            Polo Rules: A Quick Guide
          </h1>
          <p className="mt-4 max-w-2xl font-body text-lg text-polo-cream/80 leading-relaxed">
            Everything you need to know to enjoy your first match
          </p>
        </div>
      </header>

      <article className="section-cream section-pad border-t border-polo-cream-dark/60">
        <div className="max-w-2xl mx-auto space-y-14 md:space-y-20 px-4 sm:px-6">
          <IntroSection />
          <SectionBlock
            id="objective"
            title="The objective"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="9" />
                  <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
                </svg>
              </SectionIcon>
            }
          >
            <ul className="list-none space-y-2.5 font-body text-gray-600">
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Two teams compete to score goals
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Players hit the ball through the opposing team&apos;s goal
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                The team with the most goals wins
              </li>
            </ul>
          </SectionBlock>

          <div className="h-px bg-polo-cream-dark/50" role="separator" />

          <SectionBlock
            id="format"
            title="Game format"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <rect x="4" y="5" width="16" height="14" rx="1" />
                  <path d="M8 9h8M8 12h4" strokeLinecap="round" />
                </svg>
              </SectionIcon>
            }
          >
            <ul className="list-none space-y-2.5 font-body text-gray-600">
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                4 players per team
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Matches are divided into periods called <strong className="text-polo-green font-medium">chukkers</strong>
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Each chukker lasts about 7 minutes
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Games usually have 4–6 chukkers
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Players switch horses between chukkers
              </li>
            </ul>
          </SectionBlock>

          <div className="h-px bg-polo-cream-dark/50" role="separator" />

          <section id="key-rules" className="scroll-mt-24">
            <div className="mb-6 flex items-start gap-4">
              <SectionIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5h8M6 3h4l2 2h2l2-2h4v16l-3 3H9l-3-3V3z" />
                  <path strokeLinecap="round" d="M8 10h8M8 14h4" />
                </svg>
              </SectionIcon>
              <div>
                <h2 className="heading-section text-polo-green">Key rules (keep it simple)</h2>
                <p className="mt-1 font-body text-sm text-gray-500">The essentials — you&apos;ll learn the rest by watching.</p>
              </div>
            </div>
            <div className="space-y-6 pl-0 md:pl-14">
              <RuleItem title="Right of way (line of the ball)">
                <ul className="mt-2 list-none space-y-2 font-body text-gray-600">
                  <li><strong className="text-polo-green">The most important rule</strong></li>
                  <li>Players must follow the path of the ball</li>
                  <li>Crossing in front of another player on that line is dangerous and not allowed</li>
                </ul>
              </RuleItem>
              <RuleItem title="Safety first">
                <ul className="mt-2 list-none space-y-2 font-body text-gray-600">
                  <li>Dangerous riding is not allowed</li>
                  <li>Player and horse safety always comes first</li>
                </ul>
              </RuleItem>
              <RuleItem title="Ride-offs">
                <p className="mt-2 font-body text-gray-600">Players can legally push each other off the line using their horses</p>
              </RuleItem>
              <RuleItem title="Hooking">
                <p className="mt-2 font-body text-gray-600">Players can block an opponent&apos;s mallet, but only in safe positions</p>
              </RuleItem>
            </div>
          </section>

          <div className="h-px bg-polo-cream-dark/50" role="separator" />

          <SectionBlock
            id="watch"
            title="What to watch for"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none" />
                </svg>
              </SectionIcon>
            }
          >
            <ul className="list-none space-y-2.5 font-body text-gray-600">
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Play switches direction after each goal
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Watch how players position themselves, not just the ball
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Notice the speed, spacing, and teamwork
              </li>
            </ul>
          </SectionBlock>

          <div className="h-px bg-polo-cream-dark/50" role="separator" />

          <SectionBlock
            id="tips"
            title="Spectator tips"
            icon={
              <SectionIcon>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m12.73 12.72 1.41 1.42M2 12h2m16 0h2M4.93 19.07l1.41-1.42M19.35 4.93l-1.41 1.41" />
                  <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8" />
                </svg>
              </SectionIcon>
            }
          >
            <ul className="list-none space-y-2.5 font-body text-gray-600">
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Stay alert—the ball can come near the sidelines
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Watch from your tailgate or join us at the pavilion
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                You&apos;re responsible for your group, pets, and safety
              </li>
              <li className="flex gap-3">
                <span className="text-polo-gold/80" aria-hidden>·</span>
                Animals should be on a leash or under control
              </li>
            </ul>
          </SectionBlock>

          <aside className="rounded-sm border border-polo-green/15 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg text-polo-green font-semibold mb-3">Learn more</h2>
            <p className="font-body text-sm text-gray-600 mb-4">For the full official rules from the national governing body:</p>
            <a
              href="https://www.uspolo.org/sport/rules"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-body text-polo-green font-medium border-b-2 border-polo-gold/50 hover:border-polo-gold pb-0.5 transition-colors"
            >
              Full Rules from the United States Polo Association
              <span className="text-polo-gold" aria-hidden>↗</span>
            </a>
          </aside>
        </div>
      </article>
    </>
  )
}

function IntroSection() {
  return (
    <div className="text-center sm:text-left">
      <p className="font-body text-lg text-polo-green/90 leading-relaxed">
        Polo is fast, exciting, and easier to follow than it looks.
      </p>
      <p className="mt-3 font-body text-gray-600 leading-relaxed max-w-prose">
        You don&apos;t need to know every rule—just a few basics will help you enjoy the match.
      </p>
    </div>
  )
}

function SectionBlock({
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
      <div className="mb-5 flex items-start gap-4">
        {icon}
        <h2 className="heading-section text-polo-green leading-tight">{title}</h2>
      </div>
      <div className="pl-0 sm:pl-14">{children}</div>
    </section>
  )
}

function RuleItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-body font-semibold text-polo-green">{title}</h3>
      {children}
    </div>
  )
}

