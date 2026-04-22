'use client'

import { useMemo } from 'react'
import type { PoloMatchEvent } from '@/types/poloMatch'

function formatTime(iso?: string): string {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', second: '2-digit' })
  } catch {
    return '—'
  }
}

export function EventLog({ events }: { events: PoloMatchEvent[] | undefined }) {
  const sorted = useMemo(() => {
    const list = [...(events ?? [])]
    list.sort((a, b) => {
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return ta - tb
    })
    return list.slice().reverse()
  }, [events])

  if (!sorted.length) {
    return <p className="text-sm text-polo-charcoal/60">No events yet.</p>
  }

  return (
    <ul className="max-h-80 space-y-2 overflow-y-auto rounded-lg border border-polo-green-mid/15 bg-white p-3 text-sm">
      {sorted.map((e) => (
        <li key={e._key} className="border-b border-polo-cream-dark/80 pb-2 last:border-0">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="font-mono text-xs text-polo-charcoal/60">{formatTime(e.createdAt)}</span>
            <span className="rounded bg-polo-cream-dark px-1.5 py-0.5 text-xs font-semibold uppercase text-polo-green">
              Ch{e.chukkerNumber}
            </span>
            <span className="font-medium text-polo-charcoal">{e.eventType.replace(/_/g, ' ')}</span>
            {e.teamSide && (
              <span className="text-xs uppercase text-polo-green-mid">{e.teamSide}</span>
            )}
          </div>
          {e.note && <p className="mt-1 text-xs text-polo-charcoal/80">{e.note}</p>}
        </li>
      ))}
    </ul>
  )
}
