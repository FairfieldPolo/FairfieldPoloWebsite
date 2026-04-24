import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Beginner Polo Guide',
  description: 'Beginner-friendly guide for watching polo and getting involved at Fairfield Polo Club.',
}

export default function LearnBeginnerPage() {
  return (
    <>
      <PageHero
        title="Beginner Guide"
        subtitle="New to polo? Start here with the essentials."
        eyebrow="Learn"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-3xl">
          <div className="card p-7">
            <div className="gold-rule mb-5" />
            <ul className="space-y-3 font-body text-sm text-gray-600">
              <li>1. Learn the game flow and key terms.</li>
              <li>2. Attend a public match and watch from the sideline.</li>
              <li>3. Explore lessons if you want to ride and play.</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/learn/watch" className="btn-outline">How to watch</Link>
              <Link href="/learn/glossary" className="btn-outline">Key terms</Link>
              <Link href="/learn/lessons" className="btn-gold">Learn to play</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
