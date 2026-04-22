'use client'

import type { PoloPlayer } from '@/types/poloMatch'

export function PlayerRosterEditor({
  players,
  onChange,
  label,
}: {
  players: PoloPlayer[]
  onChange: (next: PoloPlayer[]) => void
  label: string
}) {
  const update = (idx: number, patch: Partial<PoloPlayer>) => {
    const next = players.map((p, i) => (i === idx ? { ...p, ...patch } : p))
    onChange(next)
  }

  const add = () => {
    onChange([
      ...players,
      {
        _key: `p_${Date.now()}`,
        name: '',
        number: '',
        position: '',
        handicap: 0,
        isAlternate: false,
      },
    ])
  }

  const remove = (idx: number) => {
    onChange(players.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-polo-green">{label}</h3>
        <button type="button" onClick={add} className="btn-outline px-3 py-1.5 text-sm">
          Add player
        </button>
      </div>
      <div className="space-y-2">
        {players.map((p, idx) => (
          <div
            key={p._key}
            className="grid gap-2 rounded-lg border border-polo-green-mid/20 bg-polo-cream/40 p-3 sm:grid-cols-12"
          >
            <input
              className="sm:col-span-4 rounded border border-polo-green-mid/30 px-2 py-1.5 text-sm"
              placeholder="Name"
              value={p.name}
              onChange={(e) => update(idx, { name: e.target.value })}
            />
            <input
              className="sm:col-span-2 rounded border border-polo-green-mid/30 px-2 py-1.5 text-sm"
              placeholder="#"
              value={p.number ?? ''}
              onChange={(e) => update(idx, { number: e.target.value })}
            />
            <input
              className="sm:col-span-2 rounded border border-polo-green-mid/30 px-2 py-1.5 text-sm"
              placeholder="Pos"
              value={p.position ?? ''}
              onChange={(e) => update(idx, { position: e.target.value })}
            />
            <input
              type="number"
              className="sm:col-span-2 rounded border border-polo-green-mid/30 px-2 py-1.5 text-sm"
              placeholder="Hcp"
              value={p.handicap ?? ''}
              onChange={(e) => update(idx, { handicap: Number(e.target.value) })}
            />
            <label className="flex items-center gap-1 text-xs sm:col-span-1">
              <input
                type="checkbox"
                checked={Boolean(p.isAlternate)}
                onChange={(e) => update(idx, { isAlternate: e.target.checked })}
              />
              Alt
            </label>
            <button type="button" onClick={() => remove(idx)} className="text-xs text-red-700 sm:col-span-1">
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
