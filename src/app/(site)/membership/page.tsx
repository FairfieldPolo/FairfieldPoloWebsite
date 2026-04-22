import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { MembershipTierIcon } from '@/components/sections/membership/MembershipTierIcon'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Membership',
  description:
    'Membership options at Fairfield Polo Club in Haysville, Kansas — social, beginner, arena, field, and family. Find your place in the club.',
}

const CONTACT = '/contact'

type Tier = {
  id: string
  name: string
  shortLabel: string
  bestFor: string
  stackLabel?: string
  bullets: string[]
  kind: 'social' | 'beginner' | 'arena' | 'field' | 'family'
  featured?: boolean
}

const PRIMARY_TIERS: Tier[] = [
  {
    id: 'social',
    name: 'Social Membership',
    shortLabel: 'Social',
    bestFor: 'Spectators and supporters of the club',
    stackLabel: 'Foundation',
    bullets: [
      'Invitations to club events and private parties',
      'Access to social gatherings and match days',
      'Connection to the polo community',
      'Discounts on club merchandise',
    ],
    kind: 'social',
  },
  {
    id: 'beginner',
    name: 'Beginner Membership',
    shortLabel: 'Beginner',
    bestFor: 'New players getting started',
    stackLabel: 'Social + learning',
    bullets: [
      'Everything in Social',
      'Lesson packages to learn the game',
      'Introduction to horses, equipment, and rules',
      'Guided entry into polo in a low-pressure environment',
    ],
    kind: 'beginner',
  },
  {
    id: 'arena',
    name: 'Arena Membership',
    shortLabel: 'Arena',
    bestFor: 'Players focused on arena polo',
    stackLabel: 'Social + arena',
    bullets: [
      'Everything in Social',
      'Access to arena practices',
      'Participation in arena matches',
      'Skill development in a more controlled setting',
    ],
    kind: 'arena',
  },
  {
    id: 'field',
    name: 'Field Membership',
    shortLabel: 'Field',
    bestFor: 'The full outdoor polo experience',
    stackLabel: 'Social, Arena + field',
    featured: true,
    bullets: [
      'Everything in Social and Arena',
      'Field practices',
      'Field matches',
      'Full access to outdoor polo play',
    ],
    kind: 'field',
  },
]

const FAMILY_TIER: Tier = {
  id: 'family',
  name: 'Family Membership',
  shortLabel: 'Family',
  bestFor: 'Households joining together',
  stackLabel: 'For families',
  bullets: [
    'Access to membership benefits for multiple family members',
    'Discounted membership fees',
    'A great way to participate together',
  ],
  kind: 'family',
}

function HeroVisual() {
  return (
    <div
      className="relative aspect-[4/3] max-h-72 w-full overflow-hidden rounded-sm border border-polo-gold/25 bg-polo-green-mid/40"
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 100%, #2d5a3d 0%, transparent 55%),
            linear-gradient(180deg, #1a3a2a 0%, #0f2218 100%)
          `,
        }}
      />
      <svg
        className="absolute bottom-0 left-1/2 w-[110%] max-w-none -translate-x-1/2"
        viewBox="0 0 400 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <ellipse cx="200" cy="150" rx="180" ry="20" fill="#2d5a3d" opacity="0.5" />
        <line x1="200" y1="40" x2="200" y2="130" stroke="#c9a84c" strokeWidth="0.8" opacity="0.4" />
        <g opacity="0.75">
          {[50, 90, 130, 170, 210, 250, 290, 330].map((x, i) => (
            <circle key={i} cx={x} cy={100 + (i % 3) * 3} r="2.2" fill="#f8f4ed" />
          ))}
        </g>
        <g stroke="#c9a84c" strokeWidth="1" strokeLinecap="round" opacity="0.85">
          <circle cx="160" cy="75" r="5" fill="none" />
          <path d="M150 100 L155 90 L160 100 L170 100 L180 88" fill="none" />
          <circle cx="240" cy="70" r="5" fill="none" />
          <path d="M250 100 L240 90 L230 100 L220 100" fill="none" />
        </g>
        <line x1="0" y1="125" x2="400" y2="125" stroke="#c9a84c" strokeWidth="0.5" opacity="0.25" />
      </svg>
    </div>
  )
}

function CheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5">
      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-polo-gold" />
      <span className="font-body text-sm leading-relaxed text-gray-600">{children}</span>
    </li>
  )
}

function TierCard({ tier, ctaLabel }: { tier: Tier; ctaLabel: string }) {
  return (
    <div
      className={`
        group flex h-full flex-col rounded-sm border bg-white p-6 shadow-sm
        transition-shadow duration-200 hover:shadow-md
        ${tier.featured
          ? 'border-polo-gold ring-1 ring-polo-gold/30'
          : 'border-polo-cream-dark'
        }
      `}
    >
      <div className="mb-4 flex items-start justify-between gap-2">
        <MembershipTierIcon kind={tier.kind} className="h-10 w-10" />
        {tier.stackLabel ? (
          <span className="rounded-sm bg-polo-cream px-2 py-1 font-body text-[0.65rem] font-semibold uppercase tracking-widest text-polo-green/80">
            {tier.stackLabel}
          </span>
        ) : null}
      </div>
      <h2 className="heading-card text-polo-green mb-1">{tier.name}</h2>
      <p className="mb-4 font-body text-xs font-medium uppercase tracking-wide text-polo-gold">Best for: {tier.bestFor}</p>
      <ul className="mb-6 flex-1 space-y-2.5">
        {tier.bullets.map((line) => (
          <CheckItem key={line}>{line}</CheckItem>
        ))}
      </ul>
      <Link
        href={CONTACT}
        className={`
          mt-auto w-full text-center text-sm font-body font-semibold
          ${tier.featured
            ? 'btn-gold'
            : 'btn-outline border-polo-cream-dark text-polo-green hover:bg-polo-green hover:text-polo-cream'
          }
        `}
      >
        {ctaLabel}
      </Link>
    </div>
  )
}

export default function MembershipPage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-polo-green pt-28 pb-14 md:pt-32">
        <div className="container-polo">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-px w-8 bg-polo-gold/60" />
                <span className="font-body text-xs uppercase tracking-[0.2em] text-polo-gold">
                  Join the club
                </span>
              </div>
              <h1 className="heading-display text-balance text-polo-cream md:text-5xl">
                Membership at Fairfield Polo Club
              </h1>
              <p className="mt-4 font-body text-lg leading-relaxed text-polo-cream/75 max-w-lg">
                Be part of the sport. Be part of the community.
              </p>
            </div>
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="section-cream section-pad">
        <div className="container-polo max-w-3xl text-center">
          <p className="font-body text-lg leading-relaxed text-gray-600">
            Whether you&apos;re here to socialize, learn, or compete, there&apos;s a place for you at Fairfield
            Polo Club.
          </p>
          <p className="mt-4 font-body text-base leading-relaxed text-gray-500">
            Our memberships are designed to grow with you — from first-time spectators to active players. All
            levels are welcome.
          </p>
        </div>
      </section>

      {/* Progression + primary tiers */}
      <section className="border-t border-polo-cream-dark bg-polo-cream/80 section-pad">
        <div className="container-polo">
          <div className="mb-10 text-center">
            <div className="gold-rule mb-4 mx-auto max-w-md" />
            <h2 className="heading-section text-polo-green">Membership types</h2>
            <p className="mt-2 font-body text-sm text-gray-500">
              Social to Field — a clear path as your involvement grows
            </p>
          </div>

          <div
            className="mb-10 hidden items-center justify-center gap-1 text-xs font-body font-medium text-polo-green/50 md:flex"
            aria-hidden="true"
          >
            {['Social', 'Beginner', 'Arena', 'Field'].map((label, i) => (
              <span key={label} className="flex items-center gap-1">
                {i > 0 ? <span className="text-polo-gold/50">→</span> : null}
                <span className="rounded-sm bg-white px-2 py-0.5 text-polo-green/70 ring-1 ring-polo-cream-dark/60">
                  {i + 1}. {label}
                </span>
              </span>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {PRIMARY_TIERS.map((tier) => (
              <TierCard key={tier.id} tier={tier} ctaLabel="Inquire" />
            ))}
          </div>

          <div className="divider-text mx-auto my-12 max-w-md text-polo-green/50">or join together</div>

          <div className="mx-auto max-w-md">
            <TierCard tier={FAMILY_TIER} ctaLabel="Inquire" />
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-green section-pad">
        <div className="container-polo text-center max-w-2xl mx-auto">
          <div className="gold-rule mb-4 mx-auto max-w-sm" />
          <h2 className="heading-section text-polo-cream">Join the club</h2>
          <p className="mt-4 font-body text-polo-cream/80 leading-relaxed">
            We built this club because we love the sport — and we want to share it. Whether you&apos;re here
            to watch, learn, or play, there&apos;s a place for you.
          </p>
          <p className="mt-2 font-body text-sm text-polo-cream/60">
            Have questions? Reach out — we&apos;re happy to help you find the right fit.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href={CONTACT} className="btn-gold min-w-[220px] justify-center text-center">
              Contact us to join
            </Link>
            <Link
              href="/about"
              className="font-body text-sm text-polo-gold hover:text-polo-gold-light transition-colors"
            >
              About the club →
            </Link>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </main>
  )
}
