import Link from 'next/link'
import type { PoloMatchListItem } from '@/types/poloMatch'

export function MatchArchiveCard({ m }: { m: PoloMatchListItem }) {
  const hs = m.homeTeam?.finalScore ?? 0
  const as = m.awayTeam?.finalScore ?? 0
  const href = `/matches/${m.slug?.current ?? ''}`
  return (
    <Link
      href={href}
      className="block rounded-xl border border-polo-green-mid/20 bg-white p-5 shadow-sm transition hover:border-polo-gold hover:shadow-md"
    >
      <p className="text-xs font-semibold uppercase tracking-wide text-polo-green-mid">{m.matchDate ?? 'Date TBA'}</p>
      <h2 className="mt-1 font-display text-lg text-polo-green">{m.title}</h2>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 font-medium">
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: m.homeTeam?.colorHex }} />
          {m.homeTeam?.name ?? 'Home'}
        </span>
        <span className="font-mono text-lg font-bold">
          {hs} — {as}
        </span>
        <span className="inline-flex items-center gap-2 font-medium">
          {m.awayTeam?.name ?? 'Away'}
          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: m.awayTeam?.colorHex }} />
        </span>
      </div>
    </Link>
  )
}
