import type { PoloTeamData, PoloTeamSide } from '@/types/poloMatch'

export function TeamCard({
  side,
  team,
  score,
  compact,
}: {
  side: PoloTeamSide
  team?: PoloTeamData
  score: number
  compact?: boolean
}) {
  const color = team?.colorHex ?? '#ccc'
  const name = team?.name ?? (side === 'home' ? 'Home' : 'Away')
  return (
    <div
      className={`flex items-center gap-3 rounded-lg border border-polo-green-mid/20 bg-white/90 shadow-sm ${
        compact ? 'p-3' : 'p-4'
      }`}
    >
      <div
        className="h-12 w-3 flex-shrink-0 rounded-full shadow-inner"
        style={{ backgroundColor: color }}
        aria-hidden
      />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-polo-green-mid">{side}</p>
        <p className="truncate font-display text-lg text-polo-green">{name}</p>
      </div>
      <div className={`font-mono font-bold text-polo-charcoal ${compact ? 'text-2xl' : 'text-3xl'}`}>{score}</div>
    </div>
  )
}
