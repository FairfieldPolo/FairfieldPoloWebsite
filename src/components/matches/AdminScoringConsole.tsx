'use client'

import { useCallback, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import type { PoloMatchDocument, PoloTeamSide } from '@/types/poloMatch'
import type { MatchActionBody } from '@/lib/match-actions'
import { computeLiveState, goalsByPlayerKey } from '@/lib/match-state'
import { usePoloMatchLiveById } from '@/components/matches/usePoloMatchLive'
import { MatchStatusBadge } from '@/components/matches/MatchStatusBadge'
import { LiveClockDisplay } from '@/components/matches/LiveClockDisplay'
import { ChukkerIndicator } from '@/components/matches/ChukkerIndicator'
import { TeamCard } from '@/components/matches/TeamCard'
import { ScoreControls } from '@/components/matches/ScoreControls'
import { GoalQuickEntry } from '@/components/matches/GoalQuickEntry'
import { PenaltyEntryModal } from '@/components/matches/PenaltyEntryModal'
import { EventLog } from '@/components/matches/EventLog'
import { ChukkerScoreTable } from '@/components/matches/ChukkerScoreTable'

function TextModal({
  title,
  open,
  onClose,
  onSave,
  placeholder,
}: {
  title: string
  open: boolean
  onClose: () => void
  onSave: (text: string) => Promise<void>
  placeholder?: string
}) {
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog">
      <div className="w-full max-w-md rounded-xl bg-polo-cream p-6 shadow-xl">
        <h2 className="font-display text-lg text-polo-green">{title}</h2>
        <textarea
          className="mt-3 w-full rounded border border-polo-green-mid/30 px-3 py-2 text-sm"
          rows={4}
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="btn-outline px-3 py-1.5 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary px-3 py-1.5 text-sm"
            disabled={busy}
            onClick={async () => {
              setBusy(true)
              try {
                await onSave(text)
                setText('')
                onClose()
              } catch {
                /* toast from parent */
              } finally {
                setBusy(false)
              }
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export function AdminScoringConsole({ matchId }: { matchId: string }) {
  const live = usePoloMatchLiveById(matchId)
  const [goalOpen, setGoalOpen] = useState(false)
  const [penOpen, setPenOpen] = useState(false)
  const [textMode, setTextMode] = useState<null | 'injury' | 'timeout' | 'note'>(null)
  const [correctOpen, setCorrectOpen] = useState(false)
  const [homeDelta, setHomeDelta] = useState('0')
  const [awayDelta, setAwayDelta] = useState('0')
  const [correctNote, setCorrectNote] = useState('')

  const doc = live ?? null

  const post = useCallback(
    async (body: MatchActionBody) => {
      const res = await fetch(`/api/admin/matches/${matchId}/actions`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error ?? res.statusText)
      return data as PoloMatchDocument
    },
    [matchId]
  )

  const run = useCallback(
    async (body: MatchActionBody) => {
      try {
        await post(body)
        toast.success('Updated')
      } catch (e) {
        toast.error(e instanceof Error ? e.message : 'Failed')
      }
    },
    [post]
  )

  const liveState = useMemo(() => (doc ? computeLiveState(doc) : null), [doc])

  const homeGoalsByPlayer = useMemo(() => (doc ? goalsByPlayerKey(doc.events, 'home') : {}), [doc])
  const awayGoalsByPlayer = useMemo(() => (doc ? goalsByPlayerKey(doc.events, 'away') : {}), [doc])

  if (live === undefined) {
    return <p className="text-polo-charcoal/70">Loading match…</p>
  }
  if (!doc) {
    return <p className="text-red-800">Match not found.</p>
  }

  const frozen = doc.status === 'final'

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-polo-green-mid/20 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-2xl text-polo-green">{doc.title}</h1>
            <p className="text-sm text-polo-charcoal/70">
              {doc.matchDate} {doc.matchTime && `· ${doc.matchTime}`}
            </p>
          </div>
          <MatchStatusBadge status={doc.status} />
        </div>
        <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" className="btn-primary px-3 py-2 text-sm" disabled={frozen} onClick={() => void run({ action: 'start_match' })}>
              Start match
            </button>
            <button type="button" className="btn-outline px-3 py-2 text-sm" disabled={frozen || !doc.liveClockRunning} onClick={() => void run({ action: 'clock_stop' })}>
              Pause clock
            </button>
            <button type="button" className="btn-outline px-3 py-2 text-sm" disabled={frozen || doc.liveClockRunning} onClick={() => void run({ action: 'clock_start' })}>
              Resume clock
            </button>
            <button
              type="button"
              className="btn-outline px-3 py-2 text-sm"
              disabled={frozen}
              onClick={() => {
                const s = window.prompt('Seconds remaining on clock?', String(liveState?.clockSecondsRemaining ?? 0))
                if (s == null) return
                const n = parseInt(s, 10)
                if (Number.isNaN(n)) return
                void run({ action: 'clock_edit', secondsRemaining: n })
              }}
            >
              Edit clock
            </button>
            <button type="button" className="btn-gold px-3 py-2 text-sm" disabled={frozen} onClick={() => void run({ action: 'end_chukker' })}>
              End chukker
            </button>
            <button type="button" className="btn-outline px-3 py-2 text-sm" disabled={frozen} onClick={() => void run({ action: 'undo_last_event' })}>
              Undo last
            </button>
            <button type="button" className="btn-primary px-3 py-2 text-sm" disabled={frozen} onClick={() => void run({ action: 'finalize' })}>
              Finalize match
            </button>
          </div>
          <div className="flex items-center gap-6">
            <ChukkerIndicator doc={doc} />
            <div>
              <p className="text-xs font-semibold uppercase text-polo-green-mid">Clock</p>
              <LiveClockDisplay doc={doc} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamCard side="home" team={doc.homeTeam} score={liveState?.homeScore ?? 0} />
        <TeamCard side="away" team={doc.awayTeam} score={liveState?.awayScore ?? 0} />
      </div>

      <ScoreControls
        disabled={frozen}
        onGoal={() => setGoalOpen(true)}
        onPenalty={() => setPenOpen(true)}
        onInjury={() => setTextMode('injury')}
        onTimeout={() => setTextMode('timeout')}
        onNote={() => setTextMode('note')}
      />

      <div className="flex flex-wrap gap-2">
        <button type="button" className="btn-outline px-3 py-1.5 text-sm" disabled={frozen} onClick={() => setCorrectOpen(true)}>
          Correct score
        </button>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-lg text-polo-green">Home roster</h3>
          <ul className="space-y-1 rounded-lg border border-polo-green-mid/15 bg-white p-3 text-sm">
            {(doc.homeTeam?.players ?? []).map((p) => (
              <li key={p._key} className="flex justify-between gap-2">
                <span>
                  {p.name} <span className="text-polo-charcoal/60">#{p.number ?? '—'} · {p.position ?? '—'} · hcp {p.handicap ?? 0}</span>
                </span>
                <span className="font-mono font-semibold">{homeGoalsByPlayer[p._key] ?? 0} goals</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-2 font-display text-lg text-polo-green">Away roster</h3>
          <ul className="space-y-1 rounded-lg border border-polo-green-mid/15 bg-white p-3 text-sm">
            {(doc.awayTeam?.players ?? []).map((p) => (
              <li key={p._key} className="flex justify-between gap-2">
                <span>
                  {p.name} <span className="text-polo-charcoal/60">#{p.number ?? '—'} · {p.position ?? '—'} · hcp {p.handicap ?? 0}</span>
                </span>
                <span className="font-mono font-semibold">{awayGoalsByPlayer[p._key] ?? 0} goals</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="mb-2 font-display text-lg text-polo-green">Chukker grid</h3>
          <ChukkerScoreTable doc={doc} />
        </div>
        <div>
          <h3 className="mb-2 font-display text-lg text-polo-green">Event log</h3>
          <EventLog events={doc.events} />
        </div>
      </section>

      <GoalQuickEntry
        doc={doc}
        open={goalOpen}
        onClose={() => setGoalOpen(false)}
        onSubmit={async ({ teamSide, playerKey, fromPenalty }) => {
          await run({ action: 'goal', teamSide, playerKey, fromPenalty })
        }}
      />

      <PenaltyEntryModal
        doc={doc}
        open={penOpen}
        onClose={() => setPenOpen(false)}
        onSubmit={async ({ teamSide, penaltyType, note }) => {
          await run({ action: 'penalty', teamSide, penaltyType, note })
        }}
      />

      <TextModal
        key={textMode ?? 'closed'}
        title={textMode === 'injury' ? 'Injury / stoppage' : textMode === 'timeout' ? 'Timeout' : 'Admin note'}
        open={textMode != null}
        onClose={() => setTextMode(null)}
        placeholder="Details for the log…"
        onSave={async (text) => {
          if (textMode === 'injury') await run({ action: 'injury', note: text })
          else if (textMode === 'timeout') await run({ action: 'timeout', note: text })
          else await run({ action: 'note', note: text })
        }}
      />

      {correctOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4" role="dialog">
          <div className="w-full max-w-md rounded-xl bg-polo-cream p-6 shadow-xl">
            <h2 className="font-display text-lg text-polo-green">Score correction</h2>
            <p className="mt-2 text-xs text-polo-charcoal/70">Creates audit events. Use positive or negative deltas.</p>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block text-sm">
                Home Δ
                <input className="mt-1 w-full rounded border px-2 py-1.5" value={homeDelta} onChange={(e) => setHomeDelta(e.target.value)} />
              </label>
              <label className="block text-sm">
                Away Δ
                <input className="mt-1 w-full rounded border px-2 py-1.5" value={awayDelta} onChange={(e) => setAwayDelta(e.target.value)} />
              </label>
            </div>
            <label className="mt-3 block text-sm">
              Note
              <input className="mt-1 w-full rounded border px-2 py-1.5" value={correctNote} onChange={(e) => setCorrectNote(e.target.value)} />
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button type="button" className="btn-outline px-3 py-1.5 text-sm" onClick={() => setCorrectOpen(false)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn-primary px-3 py-1.5 text-sm"
                onClick={() => {
                  void (async () => {
                    await run({
                      action: 'score_correct',
                      homeDelta: parseInt(homeDelta, 10) || 0,
                      awayDelta: parseInt(awayDelta, 10) || 0,
                      note: correctNote || undefined,
                    })
                    setCorrectOpen(false)
                  })()
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
