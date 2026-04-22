'use client'

import { useState } from 'react'
import type { PoloMatchDocument, PoloTeamSide } from '@/types/poloMatch'

const PRESETS = ['Safety', '60-yard', '30-yard', '10-yard', 'Spot hit', 'Other']

export function PenaltyEntryModal({
  doc,
  open,
  onClose,
  onSubmit,
}: {
  doc: PoloMatchDocument
  open: boolean
  onClose: () => void
  onSubmit: (payload: { teamSide: PoloTeamSide; penaltyType: string; note?: string }) => Promise<void>
}) {
  const [side, setSide] = useState<PoloTeamSide>('home')
  const [penaltyType, setPenaltyType] = useState(PRESETS[0])
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)

  if (!open) return null

  async function submit() {
    setBusy(true)
    try {
      await onSubmit({ teamSide: side, penaltyType, note: note || undefined })
      onClose()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/50 p-4 sm:items-center" role="dialog">
      <div className="w-full max-w-md rounded-xl bg-polo-cream p-6 shadow-xl">
        <h2 className="font-display text-xl text-polo-green">Log penalty</h2>
        <div className="mt-4 space-y-3">
          <div className="flex gap-2">
            {(['home', 'away'] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                className={`flex-1 rounded-lg border px-3 py-2 text-sm font-semibold ${
                  side === s ? 'border-polo-green bg-polo-green text-polo-cream' : 'border-polo-green-mid/40 bg-white'
                }`}
              >
                {s === 'home' ? doc.homeTeam?.name ?? 'Home' : doc.awayTeam?.name ?? 'Away'}
              </button>
            ))}
          </div>
          <label className="block text-sm font-medium">Type</label>
          <select
            className="w-full rounded border border-polo-green-mid/30 px-3 py-2"
            value={penaltyType}
            onChange={(e) => setPenaltyType(e.target.value)}
          >
            {PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
          <label className="block text-sm font-medium">Note</label>
          <textarea className="w-full rounded border px-3 py-2 text-sm" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-outline px-4 py-2 text-sm" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-primary px-4 py-2 text-sm" disabled={busy} onClick={() => void submit()}>
            Log penalty
          </button>
        </div>
      </div>
    </div>
  )
}
