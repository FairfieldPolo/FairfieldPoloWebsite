import type { PoloChukkerScoreRow, PoloMatchDocument } from '@/types/poloMatch'
import { runningTotals } from '@/lib/match-state'

function rowsByChukker(rows: PoloChukkerScoreRow[] | undefined, n: number) {
  const map = new Map<number, { home?: PoloChukkerScoreRow; away?: PoloChukkerScoreRow }>()
  for (let i = 1; i <= n; i++) map.set(i, {})
  for (const r of rows ?? []) {
    const slot = map.get(r.chukkerNumber) ?? {}
    if (r.teamSide === 'home') slot.home = r
    else slot.away = r
    map.set(r.chukkerNumber, slot)
  }
  return map
}

export function ChukkerScoreTable({ doc }: { doc: PoloMatchDocument }) {
  const n = doc.numberOfChukkers ?? 6
  const map = rowsByChukker(doc.chukkerScores, n)
  const chukkers = Array.from({ length: n }, (_, i) => i + 1)
  const live = runningTotals(doc)

  return (
    <div className="overflow-x-auto rounded-lg border border-polo-green-mid/20 bg-white">
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead>
          <tr className="border-b border-polo-cream-dark bg-polo-cream-dark/60">
            <th className="px-3 py-2 font-semibold text-polo-green">Chukker</th>
            <th className="px-3 py-2 font-semibold text-polo-green">{doc.homeTeam?.name ?? 'Home'}</th>
            <th className="px-3 py-2 font-semibold text-polo-green">{doc.awayTeam?.name ?? 'Away'}</th>
          </tr>
        </thead>
        <tbody>
          {chukkers.map((ch) => {
            const slot = map.get(ch)
            return (
              <tr key={ch} className="border-b border-polo-cream-dark/80">
                <td className="px-3 py-2 font-mono text-polo-charcoal">{ch}</td>
                <td className="px-3 py-2 font-mono">{slot?.home?.goalsInChukker ?? '—'}</td>
                <td className="px-3 py-2 font-mono">{slot?.away?.goalsInChukker ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr className="bg-polo-green/10 font-semibold">
            <td className="px-3 py-2">Running</td>
            <td className="px-3 py-2 font-mono">{doc.status === 'final' ? doc.homeTeam?.finalScore ?? live.home : live.home}</td>
            <td className="px-3 py-2 font-mono">{doc.status === 'final' ? doc.awayTeam?.finalScore ?? live.away : live.away}</td>
          </tr>
        </tfoot>
      </table>
      {doc.status !== 'final' && (
        <p className="border-t border-polo-cream-dark px-3 py-2 text-xs text-polo-charcoal/70">
          Goals per chukker update as you score; running row reflects goals and corrections.
        </p>
      )}
    </div>
  )
}
