import type { Metadata } from 'next'
import Link from 'next/link'

import { PoloFieldSilhouette } from '@/components/ui/PoloFieldSilhouette'

export const metadata: Metadata = {
  title: 'Polo Equipment',
  description:
    'Polo ponies, saddles, mallets, boots, and safety equipment — what you see on the field at Fairfield Polo Club.',
}

/** Text adapted from the former club equipment gallery (wichitapolo.org). */
const EQUIPMENT: { id: string; title: string; body: string }[] = [
  {
    id: 'polo-pony',
    title: 'Polo pony',
    body: 'They have been referred to as “ponies” but are actually horses. Average size is between 15 and 15.2 hands. The most common breeds are thoroughbred, appendix, and quarter horse.',
  },
  {
    id: 'saddle',
    title: 'Saddle',
    body: 'English-style saddle without knee rolls to allow the rider more mobility.',
  },
  {
    id: 'helmet',
    title: 'Helmet',
    body: 'Required for all players and umpires for protection while participating.',
  },
  {
    id: 'clipped-mane',
    title: 'Clipped mane',
    body: 'Polo ponies have their mane clipped to avoid interference with the reins.',
  },
  {
    id: 'mallet',
    title: 'Mallet',
    body: 'Most polo mallets are made of bamboo. They vary in length from 49" to 54" and are made to the player’s preferences.',
  },
  {
    id: 'bridle',
    title: 'Bridle',
    body: 'Personalized to each pony and player. Every pony has a bit that helps them be successful on the field.',
  },
  {
    id: 'draw-reins',
    title: 'Draw reins',
    body: 'Reins used to bring the pony’s head in for quick maneuvers.',
  },
  {
    id: 'breast-plate',
    title: 'Breast plate',
    body: 'Used to keep the player’s saddle from slipping back on the polo pony.',
  },
  {
    id: 'knee-pads',
    title: 'Knee pads',
    body: 'Covers the knees above the boots to protect from bumps and any contact with the ball.',
  },
  {
    id: 'polo-boots',
    title: 'Polo boots',
    body: 'Tall boots that protect the player from bumps and contact from the ball.',
  },
  {
    id: 'polo-bandages',
    title: 'Polo bandages',
    body: 'Used for support and protection for the polo pony.',
  },
  {
    id: 'braided-tail',
    title: 'Braided tail',
    body: 'Protects from interference with the mallet.',
  },
]

export default function LearnEquipmentPage() {
  return (
    <>
      <header className="relative overflow-hidden min-h-[38vh] md:min-h-[42vh] flex flex-col justify-end">
        <div className="absolute inset-0 bg-polo-green" aria-hidden />
        <div
          className="absolute inset-0 bg-gradient-to-br from-polo-green via-polo-green/95 to-polo-green-mid/90"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_100%_0%,rgba(201,168,76,0.12),transparent_50%)]"
          aria-hidden
        />
        <PoloFieldSilhouette className="absolute -right-4 bottom-0 w-[min(100%,32rem)] opacity-[0.07] text-polo-cream pointer-events-none" />

        <div className="relative z-10 container-polo pt-32 pb-12 md:pb-16">
          <Link
            href="/learn"
            className="mb-5 inline-flex items-center gap-1 font-body text-sm text-polo-cream/70 hover:text-polo-gold transition-colors"
          >
            <span aria-hidden>←</span> Learn polo
          </Link>
          <h1 className="heading-display text-polo-cream max-w-3xl">Polo equipment</h1>
          <p className="mt-4 max-w-2xl font-body text-lg text-polo-cream/80 leading-relaxed">
            Saddles, mallets, boots, and the gear ponies wear—what to look for next time you&apos;re
            on the sideline
          </p>
        </div>
      </header>

      <article className="section-cream section-pad border-t border-polo-cream-dark/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="font-body text-gray-600 text-center max-w-2xl mx-auto mb-12 md:mb-14">
            Mallets, saddles, ponies, and safety gear—the same information from the club&apos;s
            previous{' '}
            <a
              href="https://wichitapolo.org/polo-equipment"
              target="_blank"
              rel="noopener noreferrer"
              className="text-polo-green font-medium hover:underline underline-offset-2"
            >
              polo equipment
            </a>{' '}
            page, refreshed for this site.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {EQUIPMENT.map(item => (
              <section
                key={item.id}
                id={item.id}
                className="card p-6 scroll-mt-24 flex flex-col h-full"
              >
                <div className="gold-rule mb-4 w-12" />
                <h2 className="font-display text-xl text-polo-green font-semibold mb-3">
                  {item.title}
                </h2>
                <p className="font-body text-sm text-gray-600 leading-relaxed flex-1">{item.body}</p>
              </section>
            ))}
          </div>

          <p className="mt-14 text-center font-body text-xs text-gray-400 max-w-lg mx-auto">
            Photo pairs for each item, like the old gallery, can be added in a follow-up by placing
            images in the public folder and wiring them to each card.
          </p>
        </div>
      </article>
    </>
  )
}
