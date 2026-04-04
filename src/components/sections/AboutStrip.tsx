import Link from 'next/link'

export function AboutStrip() {
  return (
    <section className="section-green section-pad">
      <div className="container-polo">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Text */}
          <div>
            <div className="gold-rule mb-6" />
            <h2 className="heading-section text-polo-cream mb-6">
              America's Heartland<br />
              <em className="text-polo-gold">Polo Tradition</em>
            </h2>
            <p className="font-body text-polo-cream/80 leading-relaxed mb-4">
              Founded in 1931, Fairfield Polo Club is one of the oldest continuously operating
              USPA clubs in the country. Nestled on the plains south of Wichita, we've been
              bringing world-class polo to Kansas for over 90 years.
            </p>
            <p className="font-body text-polo-cream/80 leading-relaxed mb-8">
              Whether you're a seasoned player, a curious first-timer, or just looking for
              a spectacular Sunday afternoon — you're welcome here. No dress code. No pretense.
              Just great polo.
            </p>

            {/* Three values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'Open to all', body: 'Public welcome every Sunday. Bring the whole family.' },
                { title: 'USPA member', body: 'Sanctioned tournaments and competitive play.' },
                { title: 'Get involved', body: 'Lessons, memberships, and volunteer opportunities.' },
              ].map(({ title, body }) => (
                <div key={title} className="border-l-2 border-polo-gold pl-4">
                  <div className="font-display text-polo-gold font-semibold mb-1">{title}</div>
                  <p className="font-body text-sm text-polo-cream/70 leading-snug">{body}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/about" className="btn-gold">
                Our story
              </Link>
              <Link href="/contact" className="btn-outline border-polo-cream/40 text-polo-cream hover:bg-polo-cream hover:text-polo-green">
                Get in touch
              </Link>
            </div>
          </div>

          {/* Stats / visual block */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { number: '1931',   label: 'Year founded',          sub: 'One of the oldest USPA clubs' },
              { number: '90+',    label: 'Years of continuous play', sub: 'Through every Kansas season' },
              { number: '6',      label: 'Chukkers per match',    sub: '7 minutes of non-stop action' },
              { number: 'Sun 1pm',label: 'Weekly game time',      sub: 'Gates open at noon' },
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
