import Link from 'next/link'
import type { PublicPoloCopy } from '@/lib/site/publicPolo'

type Props = { polo: PublicPoloCopy }

export function AboutStrip({ polo }: Props) {
  return (
    <section className="section-green section-pad">
      <div className="container-polo">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <div className="gold-rule mb-6" />
            <h2 className="heading-section text-polo-cream mb-6">
              Club Community,<br />
              <em className="text-polo-gold">Events, and Learning</em>
            </h2>
            <p className="font-body text-polo-cream/80 leading-relaxed mb-4">
              Founded in 1931, Fairfield Polo Club is one of the oldest continuously operating
              USPA clubs in the country. Nestled on the plains south of Wichita, we've been
              bringing world-class polo to Kansas for over 90 years.
            </p>
            <p className="font-body text-polo-cream/80 leading-relaxed mb-8">
              Fairfield is where Wichita-area guests watch matches, families spend Sunday afternoons,
              and future players begin their polo journey. Explore the club, host your event,
              or learn the game.
            </p>

            {/* Three values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'Join the club', body: 'Memberships, visitor guidance, and community access.' },
                { title: 'Host your event', body: 'Weddings, private parties, and corporate gatherings.' },
                { title: 'Learn to play', body: 'Beginner education, lessons, and watch guides.' },
              ].map(({ title, body }) => (
                <div key={title} className="border-l-2 border-polo-gold pl-4">
                  <div className="font-display text-polo-gold font-semibold mb-1">{title}</div>
                  <p className="font-body text-sm text-polo-cream/70 leading-snug">{body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/club/join" className="btn-gold">
                Join the Club
              </Link>
              <Link href="/venue" className="btn-outline border-polo-cream/40 text-polo-cream hover:bg-polo-cream hover:text-polo-green">
                Host Your Event
              </Link>
              <Link href="/learn/lessons" className="font-body text-sm text-polo-gold hover:text-polo-gold-light transition-colors self-center">
                Learn to play →
              </Link>
            </div>
          </div>

          {/* Stats / visual block */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: '1931',   label: 'Year founded',          sub: 'One of the oldest USPA clubs' },
              { number: '90+',    label: 'Years of continuous play', sub: 'Through every Kansas season' },
              { number: '6',      label: 'Chukkers per match',    sub: '7 minutes of non-stop action' },
              { number: polo.statTime, label: 'Weekly game time', sub: polo.gatesStat },
            ].map(({ number, label, sub }) => (
              <div
                key={label}
                className="bg-polo-green-mid/50 border border-polo-cream/10 rounded-sm p-5"
              >
                <div className="font-display text-3xl font-bold text-polo-gold mb-1">
                  {number}
                </div>
                <div className="font-body text-sm font-medium text-polo-cream mb-1">
                  {label}
                </div>
                <div className="font-body text-xs text-polo-cream/50">
                  {sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
