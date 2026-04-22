import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { POLO_MATCHES_LIVE_OR_PREGAME_QUERY } from '@/lib/match-queries'
import type { PoloMatchListItem } from '@/types/poloMatch'

export const metadata: Metadata = {
  title: 'Live matches',
  description: 'Follow live polo scoreboards for Fairfield Polo Club matches.',
}

export default async function LiveMatchesHubPage() {
  const live = await sanityFetch<PoloMatchListItem[]>(POLO_MATCHES_LIVE_OR_PREGAME_QUERY)

  return (
    <div className="section-cream py-16">
      <div className="container-polo max-w-3xl">
        <h1 className="font-display text-4xl text-polo-green">Live matches</h1>
        <p className="mt-2 text-polo-charcoal/80">Open a match for the public scoreboard view. Pages update in real time.</p>
        <ul className="mt-8 space-y-3">
          {live.map((m) => (
            <li key={m._id}>
              <Link
                href={`/matches/${m.slug?.current ?? ''}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-polo-green-mid/20 bg-white p-5 shadow-sm transition hover:border-polo-gold"
              >
                <div>
                  <p className="font-display text-lg text-polo-green">{m.title}</p>
                  <p className="text-sm text-polo-charcoal/70">
                    {m.homeTeam?.name} vs {m.awayTeam?.name} · {m.status}
                  </p>
                </div>
                <span className="btn-outline px-4 py-2 text-sm">View</span>
              </Link>
            </li>
          ))}
        </ul>
        {!live.length && (
          <p className="mt-8 text-polo-charcoal/70">
            No published live matches right now. Check the{' '}
            <Link href="/matches" className="text-polo-green underline">
              archive
            </Link>{' '}
            or ask the club to publish a match from the admin console.
          </p>
        )}
        <p className="mt-10 text-sm text-polo-charcoal/60">
          Club operators: manage matches in{' '}
          <Link href="/admin/matches" className="text-polo-green underline">
            /admin/matches
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
