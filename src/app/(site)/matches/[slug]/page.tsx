import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { sanityFetch } from '@/lib/sanity'
import { POLO_MATCH_BY_SLUG_QUERY } from '@/lib/match-queries'
import type { PoloMatchDocument } from '@/types/poloMatch'
import { PublicMatchClient } from './PublicMatchClient'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const doc = await sanityFetch<PoloMatchDocument | null>(POLO_MATCH_BY_SLUG_QUERY, { slug })
  if (!doc) return { title: 'Match' }
  return {
    title: doc.title,
    description: `${doc.homeTeam?.name ?? 'Home'} vs ${doc.awayTeam?.name ?? 'Away'} — ${doc.eventName ?? 'Fairfield Polo'}`,
  }
}

export default async function PublicMatchPage({ params }: Props) {
  const { slug } = await params
  const initial = await sanityFetch<PoloMatchDocument | null>(POLO_MATCH_BY_SLUG_QUERY, { slug })
  if (!initial) notFound()

  const visible = Boolean(initial.publishedAt) || initial.status === 'final'
  if (!visible) notFound()

  return (
    <div className="section-cream py-16">
      <div className="container-polo max-w-5xl">
        <PublicMatchClient slug={slug} initial={initial} />
      </div>
    </div>
  )
}
