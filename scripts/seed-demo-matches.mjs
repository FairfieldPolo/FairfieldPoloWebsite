/**
 * Seeds three demo `poloMatch` documents for scoreboard preview.
 *
 * Run from repo root (requires SANITY_API_WRITE_TOKEN and public Sanity env vars):
 *
 *   SANITY_API_WRITE_TOKEN="..." \\
 *   NEXT_PUBLIC_SANITY_PROJECT_ID="..." \\
 *   NEXT_PUBLIC_SANITY_DATASET="production" \\
 *   npm run seed:matches
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

function loadDotEnv() {
  const p = resolve(process.cwd(), '.env.local')
  if (!existsSync(p)) return
  const raw = readFileSync(p, 'utf8')
  for (const line of raw.split('\n')) {
    const m = line.match(/^([^#=]+)=(.*)$/)
    if (!m) continue
    const key = m[1].trim()
    let val = m[2].trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

loadDotEnv()

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01'

if (!projectId || !dataset || !token) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, or SANITY_API_WRITE_TOKEN')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false })

function key() {
  return `k_${Math.random().toString(36).slice(2, 11)}`
}

const now = new Date()
const iso = now.toISOString()

const demoFinal = {
  _type: 'poloMatch',
  slug: { _type: 'slug', current: 'demo-spring-classic-2026' },
  title: 'Spring Sunday Classic',
  eventName: 'Sunday Public Series',
  clubName: 'Fairfield Polo Club',
  matchDate: '2026-06-14',
  matchTime: '1:00 PM',
  location: 'Main field',
  matchType: '6-goal',
  fieldType: 'Grass',
  numberOfChukkers: 6,
  chukkerDurationSeconds: 420,
  overtimeEnabled: false,
  overtimeType: 'none',
  status: 'final',
  notes: 'Demo archived match for the website scoreboard preview.',
  publishedAt: iso,
  finalizedAt: iso,
  currentChukker: 6,
  liveClockRunning: false,
  liveClockSecondsAtAnchor: 0,
  homeTeam: {
    name: 'Fairfield Green',
    colorHex: '#1a3a2a',
    handicapTotal: 12,
    startingGoals: 0,
    finalScore: 9,
    players: [
      { _key: key(), name: 'Alex Rivera', number: '1', position: '1', handicap: 2, isAlternate: false },
      { _key: key(), name: 'Jordan Lee', number: '2', position: '2', handicap: 3, isAlternate: false },
      { _key: key(), name: 'Sam Morgan', number: '3', position: '3', handicap: 4, isAlternate: false },
    ],
  },
  awayTeam: {
    name: 'Plains Gold',
    colorHex: '#c9a84c',
    handicapTotal: 12,
    startingGoals: 0,
    finalScore: 7,
    players: [
      { _key: key(), name: 'Casey Brooks', number: '1', position: '1', handicap: 2, isAlternate: false },
      { _key: key(), name: 'Riley Chen', number: '2', position: '2', handicap: 3, isAlternate: false },
      { _key: key(), name: 'Taylor Diaz', number: '3', position: '3', handicap: 4, isAlternate: false },
    ],
  },
  officials: [
    { _key: key(), name: 'Jamie Cole', role: 'Umpire 1' },
    { _key: key(), name: 'Morgan Blake', role: 'Umpire 2' },
  ],
  events: [],
  chukkerScores: [],
}

const demoLive = {
  _type: 'poloMatch',
  slug: { _type: 'slug', current: 'demo-live-sunday-scrimmage' },
  title: 'Sunday Scrimmage (demo live)',
  eventName: 'Public polo',
  clubName: 'Fairfield Polo Club',
  matchDate: '2026-06-21',
  matchTime: '1:00 PM',
  location: 'Main field',
  matchType: 'Practice / exhibition',
  fieldType: 'Grass',
  numberOfChukkers: 4,
  chukkerDurationSeconds: 420,
  overtimeEnabled: true,
  overtimeType: 'sudden_death',
  status: 'live',
  notes: 'Demo live match — open scoring console to drive updates.',
  publishedAt: iso,
  currentChukker: 2,
  liveClockRunning: true,
  liveClockAnchorIso: iso,
  liveClockSecondsAtAnchor: 312,
  homeTeam: {
    name: 'Haysville Blue',
    colorHex: '#1e40af',
    handicapTotal: 8,
    startingGoals: 0,
    finalScore: 0,
    players: [
      { _key: key(), name: 'Jamie One', number: '1', position: '1', handicap: 1, isAlternate: false },
      { _key: key(), name: 'Jamie Two', number: '2', position: '2', handicap: 2, isAlternate: false },
    ],
  },
  awayTeam: {
    name: 'Ark River Red',
    colorHex: '#991b1b',
    handicapTotal: 8,
    startingGoals: 0,
    finalScore: 0,
    players: [
      { _key: key(), name: 'Riley One', number: '1', position: '1', handicap: 1, isAlternate: false },
      { _key: key(), name: 'Riley Two', number: '2', position: '2', handicap: 2, isAlternate: false },
    ],
  },
  officials: [{ _key: key(), name: 'Pat Quinn', role: 'Field referee' }],
  events: [
    {
      _key: key(),
      chukkerNumber: 1,
      eventType: 'match_started',
      eventTimeSecondsRemaining: 420,
      createdAt: iso,
      createdBy: 'seed',
    },
    {
      _key: key(),
      chukkerNumber: 1,
      eventType: 'goal_scored',
      teamSide: 'home',
      scoreDelta: 1,
      createdAt: iso,
      createdBy: 'seed',
    },
    {
      _key: key(),
      chukkerNumber: 1,
      eventType: 'goal_scored',
      teamSide: 'away',
      scoreDelta: 1,
      createdAt: iso,
      createdBy: 'seed',
    },
    {
      _key: key(),
      chukkerNumber: 2,
      eventType: 'chukker_started',
      createdAt: iso,
      createdBy: 'seed',
    },
    {
      _key: key(),
      chukkerNumber: 2,
      eventType: 'goal_scored',
      teamSide: 'home',
      scoreDelta: 1,
      createdAt: iso,
      createdBy: 'seed',
    },
  ],
  chukkerScores: [],
}

const demoDraft = {
  _type: 'poloMatch',
  slug: { _type: 'slug', current: 'demo-draft-future-cup' },
  title: 'Future Cup (draft)',
  eventName: 'Invitational',
  clubName: 'Fairfield Polo Club',
  matchDate: '2026-07-04',
  matchTime: '3:00 PM',
  location: 'Field B',
  matchType: '8-goal',
  fieldType: 'Grass',
  numberOfChukkers: 6,
  chukkerDurationSeconds: 420,
  overtimeEnabled: false,
  overtimeType: 'none',
  status: 'draft',
  homeTeam: {
    name: 'North Side',
    colorHex: '#14532d',
    handicapTotal: 14,
    startingGoals: 0,
    finalScore: 0,
    players: [{ _key: key(), name: 'T. Player', number: '3', position: '3', handicap: 4, isAlternate: false }],
  },
  awayTeam: {
    name: 'South Side',
    colorHex: '#713f12',
    handicapTotal: 14,
    startingGoals: 0,
    finalScore: 0,
    players: [{ _key: key(), name: 'A. Player', number: '3', position: '3', handicap: 4, isAlternate: false }],
  },
  officials: [],
  events: [],
  chukkerScores: [],
}

async function upsert(slugCurrent, doc) {
  const existing = await client.fetch(`*[_type == "poloMatch" && slug.current == $slug][0]._id`, { slug: slugCurrent })
  if (existing) {
    await client.delete(existing)
    console.log('Replaced:', slugCurrent)
  }
  const res = await client.create(doc)
  console.log('Created:', slugCurrent, res._id)
}

async function main() {
  await upsert(demoFinal.slug.current, demoFinal)
  await upsert(demoLive.slug.current, demoLive)
  await upsert(demoDraft.slug.current, demoDraft)
  console.log('Done. Visit /matches/live and /matches/demo-spring-classic-2026')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
