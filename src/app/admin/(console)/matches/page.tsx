import Link from 'next/link'
import { getSanityWriteClient } from '@/lib/sanity-write'
import { POLO_MATCHES_ADMIN_LIST_QUERY } from '@/lib/match-queries'
import type { PoloMatchListItem } from '@/types/poloMatch'
import { DuplicateMatchButton, SignOutButton } from '@/components/matches/AdminMatchActions'

export const dynamic = 'force-dynamic'

export default async function AdminMatchesPage() {
  const rows = await getSanityWriteClient().fetch<PoloMatchListItem[]>(POLO_MATCHES_ADMIN_LIST_QUERY)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-polo-cream">Matches</h1>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/matches/new" className="btn-gold px-4 py-2 text-sm">
            New match
          </Link>
          <SignOutButton />
        </div>
      </div>

      <ul className="space-y-2">
        {rows.map((r) => (
          <li
            key={r._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-polo-green/30 px-4 py-3"
          >
            <div>
              <p className="font-medium text-polo-cream">{r.title}</p>
              <p className="text-xs text-polo-cream/60">
                {r.status} · {r.homeTeam?.name ?? 'Home'} vs {r.awayTeam?.name ?? 'Away'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link
                href={`/admin/matches/${r._id}/edit`}
                className="rounded border border-polo-gold/50 px-3 py-1 text-xs text-polo-gold hover:bg-polo-gold/10"
              >
                Edit setup
              </Link>
              <Link
                href={`/admin/matches/${r._id}/score`}
                className="rounded border border-polo-cream/40 px-3 py-1 text-xs text-polo-cream hover:bg-white/10"
              >
                Score
              </Link>
              <DuplicateMatchButton id={r._id} />
            </div>
          </li>
        ))}
      </ul>

      {!rows.length && <p className="text-polo-cream/60">No matches yet — create one to get started.</p>}
    </div>
  )
}
