import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

type SectionConfig = {
  title: string
  description: string
  body: string
}

const SECTIONS: Record<string, SectionConfig> = {
  weddings: {
    title: 'Weddings at Fairfield Polo Club',
    description: 'Wichita-area wedding venue with a refined outdoor polo-club backdrop.',
    body: 'Host a wedding celebration with expansive field views, sunset light, and a setting that feels both elegant and grounded in Kansas heritage.',
  },
  'private-events': {
    title: 'Private Events',
    description: 'Private party and celebration venue in the Wichita metro area.',
    body: 'From milestone birthdays to rehearsal dinners and receptions, Fairfield offers a unique venue experience tailored to your event goals.',
  },
  corporate: {
    title: 'Corporate Events',
    description: 'Corporate gatherings and client events in a premium sporting-club setting.',
    body: 'Fairfield is a strong fit for executive retreats, team events, and client entertainment with a distinctive brand-forward atmosphere.',
  },
  pavilion: {
    title: 'Pavilion Rental',
    description: 'Reserve Fairfield’s pavilion for event-day hosting and guest comfort.',
    body: 'Pavilion access supports shade, staging, and gathering space for spectators and private event groups.',
  },
  gallery: {
    title: 'Venue Gallery',
    description: 'Preview Fairfield Polo Club’s event atmosphere and venue setting.',
    body: 'Explore visual highlights from match days and private functions to help plan your own event experience.',
  },
  contact: {
    title: 'Venue Inquiry',
    description: 'Contact Fairfield Polo Club about venue availability and pricing.',
    body: 'Share your event type, preferred date, and guest count. We will follow up with availability and next steps.',
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
  return {
    title: config.title,
    description: config.description,
    keywords: ['Wichita event venue', 'Fairfield Polo Club venue', 'weddings Wichita area', 'private events Wichita'],
  }
}

export default async function VenueSectionPage(
  { params }: { params: Promise<{ section: string }> }
) {
  const { section } = await params
  const config = SECTIONS[section]
  if (!config) notFound()

  return (
    <>
      <PageHero title={config.title} subtitle={config.description} eyebrow="Venue" />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-3xl">
          <div className="card p-7">
            <div className="gold-rule mb-5" />
            <p className="font-body text-sm text-gray-600 leading-relaxed">{config.body}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/venue/contact" className="btn-gold">
                Inquire about this venue option
              </Link>
              <Link href="/contact" className="btn-outline">
                General contact
              </Link>
            </div>
          </div>
        </div>
      </section>
      <NewsletterSection />
    </>
  )
}
