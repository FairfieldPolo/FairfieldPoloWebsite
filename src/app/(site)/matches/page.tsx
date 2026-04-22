import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { POLO_MATCHES_ARCHIVE_QUERY } from '@/lib/match-queries'
import type { PoloMatchListItem } from '@/types/poloMatch'
import { MatchArchiveList } from '@/components/matches/MatchArchiveList'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Match archive',
  description: 'Completed polo matches and final scores at Fairfield Polo Club.',
}

export default async function MatchesArchivePage() {
  const matches = await sanityFetch<PoloMatchListItem[]>(POLO_MATCHES_ARCHIVE_QUERY)

  return (
    <div className="section-cream py-16">
      <div className="container-polo max-w-5xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl text-polo-green">Match archive</h1>
            <p className="mt-2 max-w-2xl text-polo-charcoal/80">Final scores, rosters, and chukker breakdowns from past matches.</p>
          </div>
          <Link href="/matches/live" className="btn-primary px-5 py-2 text-sm">
            Live matches
          </Link>
        </div>
        <MatchArchiveList matches={matches} />
      </div>
    </div>
  )
}
