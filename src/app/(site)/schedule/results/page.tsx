import type { Metadata } from 'next'
import { sanityFetch } from '@/lib/sanity'
import { POLO_MATCHES_ARCHIVE_QUERY } from '@/lib/match-queries'
import type { PoloMatchListItem } from '@/types/poloMatch'
import { MatchArchiveList } from '@/components/matches/MatchArchiveList'
import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Match Results',
  description: 'Final scores and completed match results from Fairfield Polo Club.',
}

export default async function ScheduleResultsPage() {
  const matches = await sanityFetch<PoloMatchListItem[]>(POLO_MATCHES_ARCHIVE_QUERY)

  return (
    <>
      <PageHero
        title="Match Results"
        subtitle="Completed matches with final scores and chukker breakdowns."
        eyebrow="Schedule"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-5xl">
          <MatchArchiveList matches={matches} />
        </div>
      </section>
    </>
  )
}
