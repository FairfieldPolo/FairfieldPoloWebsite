import type {
  PoloChukkerScoreRow,
  PoloMatchDocument,
  PoloMatchEvent,
  PoloLiveState,
  PoloTeamSide,
} from '@/types/poloMatch'

function teamBySide(m: PoloMatchDocument, side: PoloTeamSide) {
  return side === 'home' ? m.homeTeam : m.awayTeam
}

export function startingGoalsForSide(m: PoloMatchDocument, side: PoloTeamSide): number {
  const t = teamBySide(m, side)
  return Math.max(0, t?.startingGoals ?? 0)
}

/** Goal deltas from events, including manual score corrections. */
export function sumGoalDeltas(events: PoloMatchEvent[] | undefined, side: PoloTeamSide): number {
  if (!events?.length) return 0
  let n = 0
  for (const e of events) {
    if (e.teamSide !== side) continue
    if (e.eventType === 'goal_scored' || e.eventType === 'penalty_goal') {
      n += e.scoreDelta ?? 1
    }
    if (e.eventType === 'score_corrected' && typeof e.scoreDelta === 'number') {
      n += e.scoreDelta
    }
  }
  return n
}

export function runningTotals(m: PoloMatchDocument): { home: number; away: number } {
  const home = startingGoalsForSide(m, 'home') + sumGoalDeltas(m.events, 'home')
  const away = startingGoalsForSide(m, 'away') + sumGoalDeltas(m.events, 'away')
  return { home, away }
}

export function goalsInChukkerForSide(
  events: PoloMatchEvent[] | undefined,
  chukker: number,
  side: PoloTeamSide
): number {
  if (!events?.length) return 0
  let n = 0
  for (const e of events) {
    if (e.chukkerNumber !== chukker || e.teamSide !== side) continue
    if (e.eventType === 'goal_scored' || e.eventType === 'penalty_goal') {
      n += e.scoreDelta ?? 1
    }
    if (e.eventType === 'score_corrected' && typeof e.scoreDelta === 'number') {
      n += e.scoreDelta
    }
  }
  return n
}

export function goalsByPlayerKey(
  events: PoloMatchEvent[] | undefined,
  side: PoloTeamSide
): Record<string, number> {
  const map: Record<string, number> = {}
  if (!events) return map
  for (const e of events) {
    if (e.teamSide !== side) continue
    if ((e.eventType === 'goal_scored' || e.eventType === 'penalty_goal') && e.playerKey) {
      map[e.playerKey] = (map[e.playerKey] ?? 0) + (e.scoreDelta ?? 1)
    }
  }
  return map
}

/**
 * Rebuild chukker score rows from events + starting goals.
 * One row per (chukker, side) with running total after that chukker.
 */
export function rebuildChukkerScores(m: PoloMatchDocument): PoloChukkerScoreRow[] {
  const nChukkers = m.numberOfChukkers ?? 6
  const rows: PoloChukkerScoreRow[] = []
  let runHome = startingGoalsForSide(m, 'home')
  let runAway = startingGoalsForSide(m, 'away')

  for (let ch = 1; ch <= nChukkers; ch++) {
    const gh = goalsInChukkerForSide(m.events, ch, 'home')
    const ga = goalsInChukkerForSide(m.events, ch, 'away')
    runHome += gh
    runAway += ga
    rows.push({
      chukkerNumber: ch,
      teamSide: 'home',
      goalsInChukker: gh,
      runningTotal: runHome,
    })
    rows.push({
      chukkerNumber: ch,
      teamSide: 'away',
      goalsInChukker: ga,
      runningTotal: runAway,
    })
  }
  return rows
}

/** Effective seconds remaining on the chukker clock (uses anchor when running). */
export function effectiveClockSeconds(m: PoloMatchDocument, nowMs: number = Date.now()): number {
  const frozen = Math.max(0, Math.floor(m.liveClockSecondsAtAnchor ?? m.chukkerDurationSeconds ?? 0))
  if (!m.liveClockRunning || !m.liveClockAnchorIso) {
    return frozen
  }
  const anchor = new Date(m.liveClockAnchorIso).getTime()
  if (Number.isNaN(anchor)) return frozen
  const elapsedSec = Math.floor((nowMs - anchor) / 1000)
  return Math.max(0, frozen - elapsedSec)
}

export function computeLiveState(m: PoloMatchDocument, nowMs?: number): PoloLiveState {
  const totals = runningTotals(m)
  const t = nowMs ?? Date.now()
  const homeScore =
    m.status === 'final' && typeof m.homeTeam?.finalScore === 'number' ? m.homeTeam.finalScore : totals.home
  const awayScore =
    m.status === 'final' && typeof m.awayTeam?.finalScore === 'number' ? m.awayTeam.finalScore : totals.away
  return {
    status: m.status,
    currentChukker: Math.max(1, m.currentChukker ?? 1),
    clockRunning: Boolean(m.liveClockRunning),
    clockSecondsRemaining: effectiveClockSeconds(m, t),
    homeScore,
    awayScore,
  }
}

export function isPublished(m: PoloMatchDocument): boolean {
  return Boolean(m.publishedAt)
}

export function isFinal(m: PoloMatchDocument): boolean {
  return m.status === 'final'
}

/** Spectator-facing state label */
export function publicStatusLabel(status: PoloMatchDocument['status']): string {
  const labels: Record<string, string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    pregame: 'Pregame',
    live: 'Live',
    halftime: 'Halftime',
    between_chukkers: 'Between chukkers',
    overtime: 'Overtime',
    final: 'Final',
  }
  return labels[status ?? 'draft'] ?? status ?? ''
}
