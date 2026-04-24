import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'What Is Polo',
  description: 'An introduction to polo for first-time visitors at Fairfield Polo Club.',
}

export default function WhatIsPoloPage() {
  return (
    <>
      <PageHero
        title="What Is Polo?"
        subtitle="A fast-paced team sport on horseback built on strategy, skill, and horsemanship."
        eyebrow="Learn"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-3xl">
          <div className="card p-7">
            <div className="gold-rule mb-5" />
            <p className="font-body text-sm text-gray-600 leading-relaxed">
              Polo is played by two teams of four riders. Players use mallets to move the ball downfield
              and score through goal posts. Matches are divided into timed periods called chukkers, and
              teams switch direction after each goal.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/learn/rules" className="btn-outline">Read rules</Link>
              <Link href="/learn/watch" className="btn-outline">How to watch</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
