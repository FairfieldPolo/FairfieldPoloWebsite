import type { PoloMatchDocument } from '@/types/poloMatch'

export function ChukkerIndicator({ doc }: { doc: PoloMatchDocument }) {
  const cur = doc.currentChukker ?? 1
  const max = doc.numberOfChukkers ?? 6
  const label = doc.status === 'overtime' ? `OT (after ${max})` : `Chukker ${cur} of ${max}`
  return (
    <div className="rounded-lg bg-polo-cream-dark px-4 py-2 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-polo-green-mid">Current</p>
      <p className="font-display text-xl text-polo-green">{label}</p>
    </div>
  )
}
