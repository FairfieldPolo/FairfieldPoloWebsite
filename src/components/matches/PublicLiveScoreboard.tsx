'use client'

import { useMemo, useState, useEffect } from 'react'
import type { PoloMatchDocument } from '@/types/poloMatch'
import { computeLiveState } from '@/lib/match-state'
import { MatchStatusBadge } from '@/components/matches/MatchStatusBadge'
import { LiveClockDisplay } from '@/components/matches/LiveClockDisplay'
import { ChukkerScoreTable } from '@/components/matches/ChukkerScoreTable'
import { EventLog } from '@/components/matches/EventLog'

export function PublicLiveScoreboard({ doc }: { doc: PoloMatchDocument }) {
  const [, setTick] = useState(0)
  useEffect(() => {
    if (!doc.liveClockRunning) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => window.clearInterval(id)
  }, [doc.liveClockRunning, doc.liveClockAnchorIso])

  const live = useMemo(() => computeLiveState(doc, Date.now()), [doc])

  const homeColor = doc.homeTeam?.colorHex ?? '#1a3a2a'
  const awayColor = doc.awayTeam?.colorHex ?? '#c9a84c'

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          {doc.eventName && <p className="text-sm font-medium uppercase tracking-wide text-polo-green-mid">{doc.eventName}</p>}
          <h1 className="font-display text-3xl text-polo-green sm:text-4xl">{doc.title}</h1>
          <p className="text-sm text-polo-charcoal/75">
            {[doc.clubName, doc.location, doc.matchDate, doc.matchTime].filter(Boolean).join(' · ')}
          </p>
        </div>
        <MatchStatusBadge status={doc.status} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div
          className="flex min-h-[120px] flex-col justify-center rounded-xl p-4 text-polo-cream shadow-lg sm:min-h-[160px] sm:p-6"
          style={{ backgroundColor: homeColor }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest opacity-90">Home</p>
          <p className="truncate font-display text-xl font-bold sm:text-2xl">{doc.homeTeam?.name ?? 'Home'}</p>
          <p className="mt-2 font-mono text-5xl font-bold tabular-nums sm:text-6xl">{live.homeScore}</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-2 px-1 text-center sm:px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-polo-green-mid">Chukker {live.currentChukker}</p>
          <LiveClockDisplay doc={doc} large />
          <p className="text-xs text-polo-charcoal/70">{live.clockRunning ? 'Live clock' : 'Clock stopped'}</p>
        </div>

        <div
          className="flex min-h-[120px] flex-col justify-center rounded-xl p-4 text-polo-cream shadow-lg sm:min-h-[160px] sm:p-6"
          style={{ backgroundColor: awayColor, color: awayColor.toLowerCase() === '#ffffff' ? '#111' : undefined }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest opacity-90">Away</p>
          <p className="truncate font-display text-xl font-bold sm:text-2xl">{doc.awayTeam?.name ?? 'Away'}</p>
          <p className="mt-2 font-mono text-5xl font-bold tabular-nums sm:text-6xl">{live.awayScore}</p>
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 font-display text-xl text-polo-green">Lineups</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <ul className="rounded-lg border border-polo-green-mid/15 bg-white p-4 text-sm">
              <li className="mb-2 font-semibold text-polo-green">{doc.homeTeam?.name}</li>
              {(doc.homeTeam?.players ?? []).map((p) => (
                <li key={p._key} className="border-b border-polo-cream-dark py-1 last:border-0">
                  {p.name} <span className="text-polo-charcoal/60">#{p.number ?? '—'} pos {p.position ?? '—'} hcp {p.handicap ?? 0}</span>
                </li>
              ))}
            </ul>
            <ul className="rounded-lg border border-polo-green-mid/15 bg-white p-4 text-sm">
              <li className="mb-2 font-semibold text-polo-green">{doc.awayTeam?.name}</li>
              {(doc.awayTeam?.players ?? []).map((p) => (
                <li key={p._key} className="border-b border-polo-cream-dark py-1 last:border-0">
                  {p.name} <span className="text-polo-charcoal/60">#{p.number ?? '—'} pos {p.position ?? '—'} hcp {p.handicap ?? 0}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div>
          <h2 className="mb-3 font-display text-xl text-polo-green">Officials</h2>
          <ul className="rounded-lg border border-polo-green-mid/15 bg-white p-4 text-sm">
            {(doc.officials ?? []).map((o) => (
              <li key={o._key ?? o.name}>
                {o.name} {o.role && <span className="text-polo-charcoal/60">— {o.role}</span>}
              </li>
            ))}
            {!doc.officials?.length && <li className="text-polo-charcoal/60">None listed</li>}
          </ul>
          {doc.notes && (
            <div className="mt-4 rounded-lg border border-polo-gold/40 bg-polo-gold-light/20 p-4 text-sm">
              <h3 className="font-semibold text-polo-green">Match notes</h3>
              <p className="mt-1 whitespace-pre-wrap text-polo-charcoal">{doc.notes}</p>
            </div>
          )}
        </div>
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-polo-green">Score by chukker</h2>
        <ChukkerScoreTable doc={doc} />
      </section>

      <section>
        <h2 className="mb-3 font-display text-xl text-polo-green">Recent events</h2>
        <EventLog events={doc.events} />
      </section>
    </div>
  )
}
