import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/match-api'
import { getSanityWriteClient } from '@/lib/sanity-write'
import { randomKey } from '@/lib/match-actions'
import { POLO_MATCHES_ADMIN_LIST_QUERY } from '@/lib/match-queries'

const defaultDuration = 420

export async function GET() {
  const deny = await requireAdminApi()
  if (deny) return deny
  const list = await getSanityWriteClient().fetch(POLO_MATCHES_ADMIN_LIST_QUERY)
  return NextResponse.json(list)
}

export async function POST() {
  const deny = await requireAdminApi()
  if (deny) return deny

  const slugBase = `match-${Date.now().toString(36)}`
  const doc = {
    _type: 'poloMatch' as const,
    slug: { _type: 'slug' as const, current: slugBase },
    title: 'New polo match',
    status: 'draft' as const,
    numberOfChukkers: 6,
    chukkerDurationSeconds: defaultDuration,
    overtimeEnabled: false,
    overtimeType: 'none',
    currentChukker: 1,
    liveClockRunning: false,
    liveClockSecondsAtAnchor: defaultDuration,
    homeTeam: {
      name: 'Home',
      colorHex: '#1a3a2a',
      handicapTotal: 0,
      startingGoals: 0,
      finalScore: 0,
      players: [{ _key: randomKey(), name: 'Player 1', position: '1', handicap: 0, isAlternate: false }],
    },
    awayTeam: {
      name: 'Away',
      colorHex: '#c9a84c',
      handicapTotal: 0,
      startingGoals: 0,
      finalScore: 0,
      players: [{ _key: randomKey(), name: 'Player 1', position: '1', handicap: 0, isAlternate: false }],
    },
    officials: [],
    events: [],
    chukkerScores: [],
  }

  const id = await getSanityWriteClient().create(doc)
  return NextResponse.json({ _id: id._id })
}
