/** GROQ projections for polo matches — keep in sync with `poloMatch` schema. */

const TEAM_PROJECTION = `
  name, colorHex, handicapTotal, startingGoals, finalScore,
  players[]{ _key, name, number, position, handicap, isAlternate }
`

const MATCH_FULL = `
  _id, _type, _createdAt, _updatedAt,
  slug, eventName, clubName, title, matchDate, matchTime, location,
  matchType, fieldType, numberOfChukkers, chukkerDurationSeconds,
  overtimeEnabled, overtimeType, status, notes, publishedAt, finalizedAt,
  currentChukker, liveClockRunning, liveClockAnchorIso, liveClockSecondsAtAnchor,
  homeTeam { ${TEAM_PROJECTION} },
  awayTeam { ${TEAM_PROJECTION} },
  officials[]{ _key, name, role },
  events[] {
    _key, chukkerNumber, eventType, eventTimeSecondsRemaining,
    teamSide, playerKey, penaltyType, isConvertedPenalty, scoreDelta, note, createdAt, createdBy
  },
  chukkerScores[]{ _key, chukkerNumber, teamSide, goalsInChukker, runningTotal }
`

export const POLO_MATCH_BY_SLUG_QUERY = `
  *[_type == "poloMatch" && slug.current == $slug][0] {
    ${MATCH_FULL}
  }
`

export const POLO_MATCH_BY_ID_QUERY = `
  *[_type == "poloMatch" && _id == $id][0] {
    ${MATCH_FULL}
  }
`

export const POLO_MATCHES_ARCHIVE_QUERY = `
  *[_type == "poloMatch" && status == "final"]
  | order(coalesce(finalizedAt, matchDate) desc) {
    _id, title, slug, matchDate, status, finalizedAt,
    homeTeam { name, colorHex, finalScore },
    awayTeam { name, colorHex, finalScore }
  }
`

export const POLO_MATCHES_LIVE_OR_PREGAME_QUERY = `
  *[_type == "poloMatch" && publishedAt != null && status in ["pregame","live","halftime","between_chukkers","overtime"]]
  | order(publishedAt desc) {
    _id, title, slug, matchDate, status, publishedAt,
    homeTeam { name, colorHex, finalScore },
    awayTeam { name, colorHex, finalScore }
  }
`

export const POLO_MATCHES_ADMIN_LIST_QUERY = `
  *[_type == "poloMatch"]
  | order(_updatedAt desc) {
    _id, title, slug, matchDate, status, publishedAt, finalizedAt,
    homeTeam { name, colorHex },
    awayTeam { name, colorHex }
  }
`
