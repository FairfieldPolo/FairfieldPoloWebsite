import Link from 'next/link'

import type { PublicPoloCopy } from '@/lib/site/publicPolo'

type Props = {
  polo: PublicPoloCopy
  /** One line for map / directions, e.g. “9420 S Broadway Ave, Haysville, Kansas” */
  addressLine: string
}

export function HeroSection({ polo, addressLine }: Props) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background — dark green gradient over a polo field photo
          In production, swap the gradient for an actual photo via Sanity */}
      <div
        className="absolute inset-0 bg-polo-green"
        style={{
          backgroundImage: `
            radial-gradient(ellipse at 70% 60%, #2d5a3d 0%, #1a3a2a 50%, #0f2218 100%)
          `,
        }}
        aria-hidden="true"
      />

      {/* Decorative polo field lines */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Center line */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="#c9a84c" strokeWidth="0.1"/>
          {/* 30-yard lines */}
          <line x1="30" y1="0" x2="30" y2="100" stroke="#c9a84c" strokeWidth="0.05"/>
          <line x1="70" y1="0" x2="70" y2="100" stroke="#c9a84c" strokeWidth="0.05"/>
          {/* 60-yard lines */}
          <line x1="10" y1="0" x2="10" y2="100" stroke="#c9a84c" strokeWidth="0.05"/>
          <line x1="90" y1="0" x2="90" y2="100" stroke="#c9a84c" strokeWidth="0.05"/>
        </svg>
      </div>

      {/* Gold top accent bar */}
      <div className="absolute top-0 inset-x-0 h-1 bg-polo-gold" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 container-polo text-center px-4 pt-20 pb-16">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
          <div className="h-px w-12 bg-polo-gold/60" />
          <span className="font-body text-xs md:text-sm font-medium uppercase tracking-[0.2em] text-polo-gold">
            Haysville, Kansas · Est. 1931
          </span>
          <div className="h-px w-12 bg-polo-gold/60" />
        </div>

        {/* Main headline */}
        <h1 className="heading-display text-polo-cream mb-4 animate-fade-up text-balance">
          Where the{' '}
          <em className="text-polo-gold not-italic">Great Plains</em>
          <br className="hidden sm:block" />
          {' '}Meet the Polo Field
        </h1>

        {/* Sub-headline */}
        <p className="font-body text-lg md:text-xl text-polo-cream/75 max-w-2xl mx-auto mb-3 animate-fade-up leading-relaxed">
          {polo.narrative}
        </p>

        {/* Sunday callout */}
        <div className="inline-flex items-center gap-2 bg-polo-gold/15 border border-polo-gold/30 rounded-sm px-5 py-2.5 mb-10 animate-fade-in">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-polo-gold flex-shrink-0" aria-hidden="true">
            <rect x="1" y="2" width="14" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
            <path d="M5 1v2M11 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M1 6h14" stroke="currentColor" strokeWidth="1.2"/>
          </svg>
          <span className="font-body text-sm font-medium text-polo-gold">
            {polo.timeContact} — {addressLine}
          </span>
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
          <Link href="/schedule" className="btn-gold w-full sm:w-auto text-base px-8 py-4">
            See Upcoming Matches
          </Link>
          <Link href="/club/join" className="btn-outline border-polo-cream/40 text-polo-cream hover:bg-polo-cream hover:text-polo-green w-full sm:w-auto text-base px-8 py-4">
            Join the Club
          </Link>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-20 pt-16 border-t border-polo-cream/10">
          {[
            { number: '1931', label: 'Founded' },
            { number: '90+', label: 'Years of polo' },
            { number: 'USPA', label: 'Member club' },
          ].map(({ number, label }) => (
            <div key={label} className="text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-polo-gold">
                {number}
              </div>
              <div className="font-body text-xs text-polo-cream/50 uppercase tracking-widest mt-1">
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce" aria-hidden="true">
          <span className="font-body text-xs text-polo-cream/30 uppercase tracking-widest">Scroll</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 6l5 5 5-5" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
          </svg>
        </div>
      </div>
    </section>
  )
}
