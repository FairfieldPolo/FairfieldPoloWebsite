'use client'

import { useEffect, useMemo, useState } from 'react'
import type { PoloMatchDocument } from '@/types/poloMatch'
import { effectiveClockSeconds } from '@/lib/match-state'

function formatClock(totalSec: number): string {
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function LiveClockDisplay({
  doc,
  large,
}: {
  doc: PoloMatchDocument
  large?: boolean
}) {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    if (!doc.liveClockRunning) return
    const id = window.setInterval(() => setTick((t) => t + 1), 1000)
    return () => window.clearInterval(id)
  }, [doc.liveClockRunning, doc.liveClockAnchorIso, doc.liveClockSecondsAtAnchor])

  const sec = useMemo(
    () => effectiveClockSeconds(doc, Date.now()),
    [doc, tick]
  )

  return (
    <div
      className={`font-mono tabular-nums tracking-tight ${
        large ? 'text-5xl sm:text-6xl font-bold text-polo-charcoal' : 'text-2xl font-semibold'
      }`}
    >
      {formatClock(sec)}
    </div>
  )
}
