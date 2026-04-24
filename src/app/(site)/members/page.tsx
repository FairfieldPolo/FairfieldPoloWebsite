import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Members',
  description:
    'Member information and benefits for Fairfield Polo Club — a dedicated members area is coming soon.',
}

export default function MembersPage() {
  return (
    <>
      <PageHero
        title="Members"
        subtitle="A dedicated area for members is on the way."
        eyebrow="Club"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-2xl mx-auto text-center">
          <div className="gold-rule mb-6 mx-auto" />
          <h2 className="heading-section text-polo-green mb-4">Coming soon</h2>
          <p className="font-body text-lg text-gray-600 leading-relaxed mb-8">
            We are building a members&apos; experience on{' '}
            <span className="whitespace-nowrap text-polo-green font-medium">members.fairfield.com</span>
            &nbsp;for USPA membership, club news, and member-only content. Check back, or
            get in touch if you have questions in the meantime.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="btn-gold inline-flex">
              Contact the club
            </Link>
            <Link href="/club/history" className="btn-outline inline-flex">
              Club history
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
