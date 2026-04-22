import type { Slug } from '@/types'

/** Team side — embedded in match document (no separate Team id). */
export type PoloTeamSide = 'home' | 'away'

export type PoloMatchStatus =
  | 'draft'
  | 'scheduled'
  | 'pregame'
  | 'live'
  | 'halftime'
  | 'between_chukkers'
  | 'overtime'
  | 'final'

export type PoloOvertimeType = 'none' | 'sudden_death' | 'extra_chukker'

export type PoloMatchEventType =
  | 'match_started'
  | 'clock_started'
  | 'clock_stopped'
  | 'clock_edited'
  | 'chukker_started'
  | 'chukker_ended'
  | 'goal_scored'
  | 'penalty_logged'
  | 'penalty_goal'
  | 'injury_logged'
  | 'timeout_logged'
  | 'score_corrected'
  | 'roster_updated'
  | 'note_added'
  | 'match_finalized'

export interface PoloPlayer {
  _key: string
  name: string
  number?: string
  position?: string
  handicap?: number
  isAlternate?: boolean
}

export interface PoloTeamData {
  name?: string
  colorHex?: string
  handicapTotal?: number
  startingGoals?: number
  finalScore?: number
  players?: PoloPlayer[]
}

export interface PoloOfficial {
  _key?: string
  name?: string
  role?: string
}

export interface PoloMatchEvent {
  _key: string
  chukkerNumber: number
  eventType: PoloMatchEventType
  eventTimeSecondsRemaining?: number
  teamSide?: PoloTeamSide
  playerKey?: string
  penaltyType?: string
  isConvertedPenalty?: boolean
  scoreDelta?: number
  note?: string
  createdAt?: string
  createdBy?: string
}

export interface PoloChukkerScoreRow {
  _key?: string
  chukkerNumber: number
  teamSide: PoloTeamSide
  goalsInChukker: number
  runningTotal: number
}

export interface PoloMatchDocument {
  _id: string
  _type: 'poloMatch'
  _createdAt?: string
  _updatedAt?: string
  slug: Slug
  eventName?: string
  clubName?: string
  title: string
  matchDate?: string
  matchTime?: string
  location?: string
  matchType?: string
  fieldType?: string
  numberOfChukkers: number
  chukkerDurationSeconds: number
  overtimeEnabled?: boolean
  overtimeType?: PoloOvertimeType
  status: PoloMatchStatus
  notes?: string
  publishedAt?: string
  finalizedAt?: string
  currentChukker?: number
  liveClockRunning?: boolean
  liveClockAnchorIso?: string
  liveClockSecondsAtAnchor?: number
  homeTeam?: PoloTeamData
  awayTeam?: PoloTeamData
  officials?: PoloOfficial[]
  events?: PoloMatchEvent[]
  chukkerScores?: PoloChukkerScoreRow[]
}

/** Client-safe live view derived from stored match + wall clock. */
export interface PoloLiveState {
  status: PoloMatchStatus
  currentChukker: number
  clockRunning: boolean
  clockSecondsRemaining: number
  homeScore: number
  awayScore: number
}

export interface PoloMatchListItem {
  _id: string
  title: string
  slug: Slug
  matchDate?: string
  status: PoloMatchStatus
  publishedAt?: string
  finalizedAt?: string
  homeTeam?: Pick<PoloTeamData, 'name' | 'colorHex' | 'finalScore'>
  awayTeam?: Pick<PoloTeamData, 'name' | 'colorHex' | 'finalScore'>
}
