'use client'

import { useMemo, useState } from 'react'
import type { PoloMatchListItem } from '@/types/poloMatch'
import { MatchArchiveCard } from '@/components/matches/MatchArchiveCard'

export function MatchArchiveList({ matches }: { matches: PoloMatchListItem[] }) {
  const [q, setQ] = useState('')
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return matches
    return matches.filter(
      (m) =>
        m.title.toLowerCase().includes(s) ||
        (m.homeTeam?.name ?? '').toLowerCase().includes(s) ||
        (m.awayTeam?.name ?? '').toLowerCase().includes(s)
    )
  }, [matches, q])

  if (!matches.length) {
    return <p className="text-polo-charcoal/70">No completed matches in the archive yet.</p>
  }

  return (
    <div className="space-y-4">
      <label className="block max-w-md">
        <span className="text-sm font-medium text-polo-green">Filter</span>
        <input
          className="mt-1 w-full rounded border border-polo-green-mid/30 px-3 py-2 text-sm"
          placeholder="Search by team or title…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </label>
      <ul className="grid gap-4 md:grid-cols-2">
        {filtered.map((m) => (
          <li key={m._id}>
            <MatchArchiveCard m={m} />
          </li>
        ))}
      </ul>
      {filtered.length === 0 && <p className="text-sm text-polo-charcoal/60">No matches match that filter.</p>}
    </div>
  )
}
