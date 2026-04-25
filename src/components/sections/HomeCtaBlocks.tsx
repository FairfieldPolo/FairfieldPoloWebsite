import Link from 'next/link'

const CTA_BLOCKS = [
  {
    title: 'Upcoming Matches',
    body: 'See the next public matches, seasonal events, and match-day details.',
    href: '/schedule',
  },
  {
    title: 'Join the Club',
    body: 'Explore membership options and find your place in the Fairfield community.',
    href: '/club/join',
  },
  {
    title: 'Host Your Event',
    body: 'Plan weddings, corporate events, private parties, and venue rentals.',
    href: '/venue',
  },
  {
    title: 'Learn to Play',
    body: 'Start with beginner guidance, lessons, and next steps for new players.',
    href: '/learn/lessons',
  },
]

export function HomeCtaBlocks() {
  return (
    <section className="section-cream border-b border-polo-cream-dark">
      <div className="container-polo -mt-16 relative z-20 pb-10">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CTA_BLOCKS.map((block) => (
            <Link
              key={block.href}
              href={block.href}
              className="group card p-6 shadow-lg transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="gold-rule mb-4 w-12 transition-all duration-200 group-hover:w-16" />
              <h2 className="heading-card text-polo-green mb-2">{block.title}</h2>
              <p className="font-body text-sm leading-relaxed text-gray-600">{block.body}</p>
              <span className="mt-5 inline-flex font-body text-sm font-medium text-polo-green transition-colors group-hover:text-polo-green-light">
                Explore →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
