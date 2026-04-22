'use client'

import { useState } from 'react'
import type { PoloMatchDocument, PoloTeamSide } from '@/types/poloMatch'

export function GoalQuickEntry({
  doc,
  open,
  onClose,
  onSubmit,
}: {
  doc: PoloMatchDocument
  open: boolean
  onClose: () => void
  onSubmit: (payload: { teamSide: PoloTeamSide; playerKey?: string; fromPenalty?: boolean }) => Promise<void>
}) {
  const [side, setSide] = useState<PoloTeamSide>('home')
  const [playerKey, setPlayerKey] = useState<string>('')
  const [fromPenalty, setFromPenalty] = useState(false)
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const roster = (side === 'home' ? doc.homeTeam?.players : doc.awayTeam?.players) ?? []

  async function submit() {
    setBusy(true)
    try {
      await onSubmit({ teamSide: side, playerKey: playerKey || undefined, fromPenalty })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog">
      <div className="w-full max-w-md rounded-xl bg-polo-cream p-6 shadow-xl">
        <h2 className="font-display text-xl text-polo-green">Record goal</h2>
        <div className="mt-4 space-y-3">
          <label className="block text-sm font-medium">Team</label>
          <div className="flex gap-2">
            {(['home', 'away'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSide(s)
                  setPlayerKey('')
                }}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  side === s ? 'border-polo-green bg-polo-green text-polo-cream' : 'border-polo-green-mid/40 bg-white'
                }`}
              >
                {s === 'home' ? doc.homeTeam?.name ?? 'Home' : doc.awayTeam?.name ?? 'Away'}
              </button>
            ))}
          </div>
          <label className="block text-sm font-medium">Player (optional)</label>
          <select
            className="w-full rounded border border-polo-green-mid/30 px-3 py-2"
            value={playerKey}
            onChange={(e) => setPlayerKey(e.target.value)}
          >
            <option value="">Unassigned</option>
            {roster.map((p) => (
              <option key={p._key} value={p._key}>
                {p.name} {p.number ? `#${p.number}` : ''} · pos {p.position ?? '—'}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={fromPenalty} onChange={(e) => setFromPenalty(e.target.checked)} />
            Penalty goal
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-outline px-4 py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary px-4 py-2 text-sm" disabled={busy} onClick={() => void submit()}>
            Save goal
          </button>
        </div>
      </div>
    </div>
  )
}
