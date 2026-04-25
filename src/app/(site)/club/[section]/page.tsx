import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { membersUrl } from '@/lib/site/members-url'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

type SectionConfig = {
  title: string
  description: string
  body: string
  ctas?: { label: string; href: string }[]
}

const SECTIONS: Record<string, SectionConfig> = {
  membership: {
    title: 'Club Membership',
    description: 'Explore Fairfield Polo Club membership levels and find the right fit for your goals.',
    body: 'Fairfield offers social, beginner, arena, field, and family-oriented paths so members can engage at their own pace and interests.',
    ctas: [{ label: 'View membership details', href: '/membership' }, { label: 'Join the club', href: '/club/join' }],
  },
  join: {
    title: 'Join the Club',
    description: 'Start your Fairfield Polo Club membership journey.',
    body: 'Whether you want to watch, learn, or play, joining the club starts with a quick inquiry so we can guide you to the right level.',
    ctas: [{ label: 'Contact the club', href: '/contact' }, { label: 'Membership levels', href: '/club/membership' }],
  },
  members: {
    title: 'Members Portal',
    description: 'Member access and updates for Fairfield Polo Club.',
    body: 'Active members can use the members portal for account and club resources.',
    ctas: [{ label: 'Open members portal', href: membersUrl() }, { label: 'Contact support', href: '/contact' }],
  },
  visit: {
    title: 'Visitor Information',
    description: 'Plan your visit to Fairfield Polo Club with guidance for directions and game-day setup.',
    body: 'Visitors are welcome. Bring lawn chairs, check event timing, and follow weather updates before travel.',
    ctas: [{ label: 'Get directions', href: '/contact#directions' }, { label: 'See schedule', href: '/schedule' }],
  },
  map: {
    title: 'Property Map',
    description: 'Find entrances, viewing areas, and gathering spaces at Fairfield Polo Club.',
    body: 'Use this page as a property guide for tailgating, pavilion access, and spectator zones on match days.',
    ctas: [{ label: 'Visitor information', href: '/club/visit' }, { label: 'Contact us', href: '/contact' }],
  },
  tailgating: {
    title: 'Tailgating & Pavilion',
    description: 'Game-day tailgating and pavilion information for Fairfield Polo Club visitors.',
    body: 'Tailgating and pavilion gathering are part of the Fairfield match-day experience. Bring chairs, plan your setup, and use this page for guest guidance as the club adds more detailed maps and rules.',
    ctas: [{ label: 'Visitor information', href: '/club/visit' }, { label: 'See schedule', href: '/schedule' }],
  },
  history: {
    title: 'Club History',
    description: 'Learn the long-standing history of Fairfield Polo Club.',
    body: 'Founded in 1931, Fairfield Polo Club is one of the oldest continuously operating USPA member clubs in the United States.',
    ctas: [{ label: 'Read the full story', href: '/about' }, { label: 'Membership', href: '/club/membership' }],
  },
  faqs: {
    title: 'Club FAQs',
    description: 'Common questions about visiting, joining, and attending events at Fairfield Polo Club.',
    body: 'Find quick answers for visitors, prospective members, and first-time spectators. The club can expand this page with detailed policies, weather guidance, tailgating notes, and membership questions.',
    ctas: [{ label: 'Contact the club', href: '/contact' }, { label: 'How to watch polo', href: '/learn/watch' }],
  },
}

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((section) => ({ section }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ section: string }> }
): Promise<Metadata> {
  const { section } = await params
  const config = SECTIONS[section]
  if (!config) return {}
  return { title: config.title, description: config.description }
}

export default async function ClubSectionPage(
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  const config = SECTIONS[section]
  if (!config) notFound()

  return (
    <>
      <PageHero title={config.title} subtitle={config.description} eyebrow="Club" />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-3xl">
          <div className="card p-7">
            <div className="gold-rule mb-5" />
            <p className="font-body text-sm text-gray-600 leading-relaxed">{config.body}</p>
            {config.ctas?.length ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {config.ctas.map((cta) => (
                  <Link key={cta.href} href={cta.href} className="btn-outline">
                    {cta.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <NewsletterSection />
    </>
  )
}
