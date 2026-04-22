'use client'

export function ScoreControls({
  onGoal,
  onPenalty,
  onInjury,
  onTimeout,
  onNote,
  disabled,
}: {
  onGoal: () => void
  onPenalty: () => void
  onInjury: () => void
  onTimeout: () => void
  onNote: () => void
  disabled?: boolean
}) {
  const btn = 'rounded-lg border border-polo-green-mid/30 bg-white px-3 py-2 text-sm font-semibold text-polo-green hover:bg-polo-cream-dark disabled:opacity-40'
  return (
    <div className="flex flex-wrap gap-2">
      <button type="button" className={btn} disabled={disabled} onClick={onGoal}>
        Goal
      </button>
      <button type="button" className={btn} disabled={disabled} onClick={onPenalty}>
        Penalty
      </button>
      <button type="button" className={btn} disabled={disabled} onClick={onInjury}>
        Injury / stoppage
      </button>
      <button type="button" className={btn} disabled={disabled} onClick={onTimeout}>
        Timeout
      </button>
      <button type="button" className={btn} disabled={disabled} onClick={onNote}>
        Note
      </button>
    </div>
  )
}
