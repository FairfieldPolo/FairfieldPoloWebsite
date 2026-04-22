import type { PoloMatchStatus } from '@/types/poloMatch'
import { publicStatusLabel } from '@/lib/match-state'

const tone: Record<string, string> = {
  draft: 'bg-stone-200 text-stone-800',
  scheduled: 'bg-sky-100 text-sky-900',
  pregame: 'bg-amber-100 text-amber-900',
  live: 'bg-red-600 text-white',
  halftime: 'bg-violet-100 text-violet-900',
  between_chukkers: 'bg-violet-100 text-violet-900',
  overtime: 'bg-orange-600 text-white',
  final: 'bg-polo-green text-polo-cream',
}

export function MatchStatusBadge({ status }: { status: PoloMatchStatus }) {
  const cls = tone[status] ?? 'bg-stone-200 text-stone-800'
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-0.5 text-xs font-semibold uppercase tracking-wide ${cls}`}>
      {publicStatusLabel(status)}
    </span>
  )
}
