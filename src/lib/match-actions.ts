import type {
  PoloMatchDocument,
  PoloMatchEvent,
  PoloMatchEventType,
  PoloTeamSide,
} from '@/types/poloMatch'
import { effectiveClockSeconds, rebuildChukkerScores, runningTotals } from '@/lib/match-state'

export function randomKey(): string {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

function nowIso(): string {
  return new Date().toISOString()
}

function makeEvent(
  doc: PoloMatchDocument,
  type: PoloMatchEventType,
  partial: Omit<Partial<PoloMatchEvent>, '_key' | 'eventType' | 'createdAt'>,
  actor: string
): PoloMatchEvent {
  const clock = effectiveClockSeconds(doc)
  return {
    _key: randomKey(),
    chukkerNumber: doc.currentChukker ?? 1,
    eventType: type,
    eventTimeSecondsRemaining: partial.eventTimeSecondsRemaining ?? clock,
    teamSide: partial.teamSide,
    playerKey: partial.playerKey,
    penaltyType: partial.penaltyType,
    isConvertedPenalty: partial.isConvertedPenalty,
    scoreDelta: partial.scoreDelta,
    note: partial.note,
    createdAt: nowIso(),
    createdBy: actor,
  }
}

export type MatchActionBody =
  | { action: 'publish_live' }
  | { action: 'save_draft'; setup: MatchSetupInput }
  | { action: 'start_match' }
  | { action: 'clock_start' }
  | { action: 'clock_stop' }
  | { action: 'clock_edit'; secondsRemaining: number }
  | { action: 'end_chukker' }
  | { action: 'goal'; teamSide: PoloTeamSide; playerKey?: string; fromPenalty?: boolean }
  | { action: 'penalty'; teamSide: PoloTeamSide; penaltyType: string; note?: string }
  | { action: 'penalty_goal'; teamSide: PoloTeamSide; playerKey?: string }
  | { action: 'injury'; note: string }
  | { action: 'timeout'; note?: string }
  | { action: 'note'; note: string }
  | { action: 'score_correct'; homeDelta: number; awayDelta: number; note?: string }
  | { action: 'finalize' }
  | { action: 'undo_last_event' }

export interface MatchSetupInput {
  eventName?: string
  clubName?: string
  title: string
  slug: string
  matchDate?: string
  matchTime?: string
  location?: string
  matchType?: string
  fieldType?: string
  numberOfChukkers: number
  chukkerDurationSeconds: number
  overtimeEnabled: boolean
  overtimeType: string
  notes?: string
  homeTeam: {
    name: string
    colorHex: string
    handicapTotal: number
    startingGoals: number
    players: { _key?: string; name: string; number?: string; position?: string; handicap?: number; isAlternate?: boolean }[]
  }
  awayTeam: {
    name: string
    colorHex: string
    handicapTotal: number
    startingGoals: number
    players: { _key?: string; name: string; number?: string; position?: string; handicap?: number; isAlternate?: boolean }[]
  }
  officials: { _key?: string; name?: string; role?: string }[]
}

function ensurePlayerKeys(
  team: MatchSetupInput['homeTeam']
): { name: string; colorHex: string; handicapTotal: number; startingGoals: number; finalScore: number; players: NonNullable<PoloMatchDocument['homeTeam']>['players'] } {
  return {
    name: team.name,
    colorHex: team.colorHex,
    handicapTotal: team.handicapTotal,
    startingGoals: team.startingGoals,
    finalScore: 0,
    players: team.players.map((p) => ({
      _key: p._key && p._key.length > 0 ? p._key : randomKey(),
      name: p.name,
      number: p.number,
      position: p.position,
      handicap: p.handicap,
      isAlternate: p.isAlternate ?? false,
    })),
  }
}

export function validatePublishable(doc: PoloMatchDocument): string | null {
  if (!doc.homeTeam?.name?.trim()) return 'Home team name is required'
  if (!doc.awayTeam?.name?.trim()) return 'Away team name is required'
  if (!doc.homeTeam?.colorHex?.trim()) return 'Home team color is required'
  if (!doc.awayTeam?.colorHex?.trim()) return 'Away team color is required'
  if ((doc.homeTeam?.players?.length ?? 0) < 1) return 'Home team needs at least one player'
  if ((doc.awayTeam?.players?.length ?? 0) < 1) return 'Away team needs at least one player'
  if (!doc.numberOfChukkers || doc.numberOfChukkers < 1) return 'Number of chukkers is required'
  return null
}

export function applyMatchAction(
  doc: PoloMatchDocument,
  body: MatchActionBody,
  actor: string
): { patch: Partial<PoloMatchDocument> } | { error: string; status?: number } {
  if (doc.status === 'final' && body.action !== 'save_draft') {
    return { error: 'Match is finalized and cannot be changed from the console.', status: 400 }
  }

  const events = [...(doc.events ?? [])]

  const push = (e: PoloMatchEvent) => {
    events.push(e)
  }

  const duration = doc.chukkerDurationSeconds ?? 420
  let next: Partial<PoloMatchDocument> = {}

  switch (body.action) {
    case 'save_draft': {
      const { setup } = body
      next = {
        eventName: setup.eventName,
        clubName: setup.clubName,
        title: setup.title,
        slug: { _type: 'slug', current: setup.slug },
        matchDate: setup.matchDate,
        matchTime: setup.matchTime,
        location: setup.location,
        matchType: setup.matchType,
        fieldType: setup.fieldType,
        numberOfChukkers: setup.numberOfChukkers,
        chukkerDurationSeconds: setup.chukkerDurationSeconds,
        overtimeEnabled: setup.overtimeEnabled,
        overtimeType: setup.overtimeType as PoloMatchDocument['overtimeType'],
        notes: setup.notes,
        homeTeam: ensurePlayerKeys(setup.homeTeam),
        awayTeam: ensurePlayerKeys(setup.awayTeam),
        officials: setup.officials.map((o) => ({
          _key: o._key && o._key.length > 0 ? o._key : randomKey(),
          name: o.name,
          role: o.role,
        })),
        status: doc.status === 'final' ? 'final' : doc.status,
      }
      return { patch: next }
    }

    case 'publish_live': {
      const err = validatePublishable(doc)
      if (err) return { error: err, status: 400 }
      push(makeEvent(doc, 'note_added', { note: 'Published to live scoreboard' }, actor))
      next = {
        publishedAt: nowIso(),
        status: 'pregame' as const,
        liveClockSecondsAtAnchor: duration,
        liveClockRunning: false,
        liveClockAnchorIso: undefined,
        currentChukker: 1,
        events,
      }
      return { patch: next }
    }

    case 'start_match': {
      if (!doc.publishedAt) return { error: 'Publish the match before starting.', status: 400 }
      push(makeEvent(doc, 'match_started', {}, actor))
      next = {
        status: 'live' as const,
        currentChukker: 1,
        liveClockSecondsAtAnchor: duration,
        liveClockRunning: false,
        liveClockAnchorIso: undefined,
        events,
      }
      return { patch: next }
    }

    case 'clock_start': {
      const sec = effectiveClockSeconds(doc)
      next = {
        liveClockRunning: true,
        liveClockAnchorIso: nowIso(),
        liveClockSecondsAtAnchor: sec,
        events: [...events, makeEvent(doc, 'clock_started', { eventTimeSecondsRemaining: sec }, actor)],
      }
      if (doc.status === 'pregame') next.status = 'live'
      return { patch: next }
    }

    case 'clock_stop': {
      const sec = effectiveClockSeconds(doc)
      push(makeEvent(doc, 'clock_stopped', { eventTimeSecondsRemaining: sec }, actor))
      next = {
        liveClockRunning: false,
        liveClockAnchorIso: undefined,
        liveClockSecondsAtAnchor: sec,
        events,
      }
      return { patch: next }
    }

    case 'clock_edit': {
      const sec = Math.max(0, Math.floor(body.secondsRemaining))
      push(
        makeEvent(doc, 'clock_edited', { eventTimeSecondsRemaining: sec, note: `Set to ${sec}s` }, actor)
      )
      next = {
        liveClockRunning: false,
        liveClockAnchorIso: undefined,
        liveClockSecondsAtAnchor: sec,
        events,
      }
      return { patch: next }
    }

    case 'end_chukker': {
      const ch = doc.currentChukker ?? 1
      const maxCh = doc.numberOfChukkers ?? 6
      push(makeEvent(doc, 'chukker_ended', {}, actor))
      if (ch < maxCh) {
        const newCh = ch + 1
        const interim = { ...doc, events, currentChukker: newCh } as PoloMatchDocument
        push(makeEvent(interim, 'chukker_started', {}, actor))
        next = {
          currentChukker: newCh,
          status: 'between_chukkers' as const,
          liveClockRunning: false,
          liveClockAnchorIso: undefined,
          liveClockSecondsAtAnchor: duration,
          events,
        }
      } else {
        next = {
          status: doc.overtimeEnabled ? ('overtime' as const) : ('between_chukkers' as const),
          liveClockRunning: false,
          liveClockAnchorIso: undefined,
          liveClockSecondsAtAnchor: doc.overtimeEnabled ? duration : 0,
          events,
        }
      }
      const docForRebuild = { ...doc, ...next, events } as PoloMatchDocument
      next.chukkerScores = rebuildChukkerScores(docForRebuild)
      return { patch: next }
    }

    case 'goal': {
      const e = makeEvent(
        doc,
        body.fromPenalty ? 'penalty_goal' : 'goal_scored',
        {
          teamSide: body.teamSide,
          playerKey: body.playerKey,
          scoreDelta: 1,
        },
        actor
      )
      push(e)
      const docForRebuild = { ...doc, events } as PoloMatchDocument
      next = { events, chukkerScores: rebuildChukkerScores(docForRebuild) }
      return { patch: next }
    }

    case 'penalty': {
      push(
        makeEvent(doc, 'penalty_logged', {
          teamSide: body.teamSide,
          penaltyType: body.penaltyType,
          note: body.note,
        }, actor)
      )
      next = { events }
      return { patch: next }
    }

    case 'penalty_goal': {
      push(
        makeEvent(doc, 'penalty_goal', {
          teamSide: body.teamSide,
          playerKey: body.playerKey,
          scoreDelta: 1,
        }, actor)
      )
      const docForRebuild = { ...doc, events } as PoloMatchDocument
      next = { events, chukkerScores: rebuildChukkerScores(docForRebuild) }
      return { patch: next }
    }

    case 'injury': {
      push(makeEvent(doc, 'injury_logged', { note: body.note }, actor))
      next = { events }
      return { patch: next }
    }

    case 'timeout': {
      push(makeEvent(doc, 'timeout_logged', { note: body.note }, actor))
      next = { events }
      return { patch: next }
    }

    case 'note': {
      push(makeEvent(doc, 'note_added', { note: body.note }, actor))
      next = { events }
      return { patch: next }
    }

    case 'score_correct': {
      const note =
        [body.note, `homeDelta=${body.homeDelta}`, `awayDelta=${body.awayDelta}`].filter(Boolean).join(' · ')
      if (body.homeDelta !== 0) {
        push(
          makeEvent(doc, 'score_corrected', {
            teamSide: 'home',
            scoreDelta: body.homeDelta,
            note,
          }, actor)
        )
      }
      if (body.awayDelta !== 0) {
        push(
          makeEvent(doc, 'score_corrected', {
            teamSide: 'away',
            scoreDelta: body.awayDelta,
            note,
          }, actor)
        )
      }
      if (body.homeDelta === 0 && body.awayDelta === 0) {
        push(makeEvent(doc, 'score_corrected', { note: note || 'Manual correction (no delta)' }, actor))
      }
      next = { events, chukkerScores: rebuildChukkerScores({ ...doc, events } as PoloMatchDocument) }
      return { patch: next }
    }

    case 'finalize': {
      const totals = runningTotals({ ...doc, events } as PoloMatchDocument)
      push(makeEvent({ ...doc, events } as PoloMatchDocument, 'match_finalized', {}, actor))
      next = {
        status: 'final' as const,
        finalizedAt: nowIso(),
        liveClockRunning: false,
        liveClockAnchorIso: undefined,
        liveClockSecondsAtAnchor: 0,
        events,
        homeTeam: {
          ...doc.homeTeam,
          name: doc.homeTeam?.name,
          colorHex: doc.homeTeam?.colorHex,
          finalScore: totals.home,
        },
        awayTeam: {
          ...doc.awayTeam,
          name: doc.awayTeam?.name,
          colorHex: doc.awayTeam?.colorHex,
          finalScore: totals.away,
        },
        chukkerScores: rebuildChukkerScores({ ...doc, events } as PoloMatchDocument),
      }
      return { patch: next }
    }

    case 'undo_last_event': {
      if (events.length < 1) return { error: 'Nothing to undo', status: 400 }
      const last = events[events.length - 1]
      if (last?.eventType === 'match_finalized') {
        return { error: 'Cannot undo finalize', status: 400 }
      }
      events.pop()
      const docForRebuild = { ...doc, events } as PoloMatchDocument
      next = { events, chukkerScores: rebuildChukkerScores(docForRebuild) }
      return { patch: next }
    }

    default:
      return { error: 'Unknown action', status: 400 }
  }
}
