import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/match-api'
import { getSanityWriteClient } from '@/lib/sanity-write'
import { POLO_MATCH_BY_ID_QUERY } from '@/lib/match-queries'
import type { PoloMatchDocument, PoloPlayer, PoloOfficial } from '@/types/poloMatch'
import { randomKey } from '@/lib/match-actions'

type Ctx = { params: Promise<{ id: string }> }

function remapPlayers(players: PoloPlayer[] | undefined): PoloPlayer[] {
  return (players ?? []).map((p) => ({ ...p, _key: randomKey() }))
}

function remapOfficials(officials: PoloOfficial[] | undefined): PoloOfficial[] {
  return (officials ?? []).map((o) => ({ ...o, _key: randomKey() }))
}

export async function POST(_req: Request, ctx: Ctx) {
  const deny = await requireAdminApi()
  if (deny) return deny
  const { id } = await ctx.params
  const client = getSanityWriteClient()
  const doc = await client.fetch<PoloMatchDocument | null>(POLO_MATCH_BY_ID_QUERY, { id })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const slug = `${doc.slug?.current ?? 'match'}-copy-${Date.now().toString(36)}`

  const copy = {
    _type: 'poloMatch' as const,
    slug: { _type: 'slug' as const, current: slug },
    title: `${doc.title} (copy)`,
    eventName: doc.eventName,
    clubName: doc.clubName,
    matchDate: doc.matchDate,
    matchTime: doc.matchTime,
    location: doc.location,
    matchType: doc.matchType,
    fieldType: doc.fieldType,
    numberOfChukkers: doc.numberOfChukkers,
    chukkerDurationSeconds: doc.chukkerDurationSeconds,
    overtimeEnabled: doc.overtimeEnabled,
    overtimeType: doc.overtimeType,
    notes: doc.notes,
    status: 'draft' as const,
    publishedAt: undefined,
    finalizedAt: undefined,
    currentChukker: 1,
    liveClockRunning: false,
    liveClockAnchorIso: undefined,
    liveClockSecondsAtAnchor: doc.chukkerDurationSeconds ?? 420,
    homeTeam: doc.homeTeam
      ? { ...doc.homeTeam, finalScore: 0, players: remapPlayers(doc.homeTeam.players) }
      : undefined,
    awayTeam: doc.awayTeam
      ? { ...doc.awayTeam, finalScore: 0, players: remapPlayers(doc.awayTeam.players) }
      : undefined,
    officials: remapOfficials(doc.officials),
    events: [],
    chukkerScores: [],
  }

  const created = await client.create(copy)
  return NextResponse.json({ _id: created._id })
}
