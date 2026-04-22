import { defineType, defineField } from 'sanity'

const MATCH_STATUS = [
  { title: 'Draft', value: 'draft' },
  { title: 'Scheduled', value: 'scheduled' },
  { title: 'Pregame', value: 'pregame' },
  { title: 'Live', value: 'live' },
  { title: 'Halftime', value: 'halftime' },
  { title: 'Between chukkers', value: 'between_chukkers' },
  { title: 'Overtime', value: 'overtime' },
  { title: 'Final', value: 'final' },
] as const

const OVERTIME_TYPE = [
  { title: 'None', value: 'none' },
  { title: 'Sudden death', value: 'sudden_death' },
  { title: 'Extra chukker', value: 'extra_chukker' },
] as const

const playerFields = [
  defineField({
    name: 'name',
    title: 'Player name',
    type: 'string',
    validation: (Rule) => Rule.required(),
  }),
  defineField({ name: 'number', title: 'Jersey #', type: 'string' }),
  defineField({ name: 'position', title: 'Position (1–4, etc.)', type: 'string' }),
  defineField({ name: 'handicap', title: 'Handicap', type: 'number' }),
  defineField({ name: 'isAlternate', title: 'Alternate', type: 'boolean', initialValue: false }),
]

const teamObject = defineField({
  name: 'homeTeam',
  title: 'Home team',
  type: 'object',
  group: 'teams',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Team name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'colorHex', type: 'string', title: 'Color (hex)', validation: (Rule) => Rule.required() }),
    defineField({ name: 'handicapTotal', type: 'number', title: 'Team handicap total', initialValue: 0 }),
    defineField({ name: 'startingGoals', type: 'number', title: 'Starting goals', initialValue: 0 }),
    defineField({ name: 'finalScore', type: 'number', title: 'Final score (set on finalize)', initialValue: 0 }),
    defineField({
      name: 'players',
      type: 'array',
      title: 'Players',
      of: [{ type: 'object', name: 'poloPlayer', fields: playerFields }],
    }),
  ],
})

const awayTeamObject = defineField({
  name: 'awayTeam',
  title: 'Away team',
  type: 'object',
  group: 'teams',
  fields: [
    defineField({ name: 'name', type: 'string', title: 'Team name', validation: (Rule) => Rule.required() }),
    defineField({ name: 'colorHex', type: 'string', title: 'Color (hex)', validation: (Rule) => Rule.required() }),
    defineField({ name: 'handicapTotal', type: 'number', title: 'Team handicap total', initialValue: 0 }),
    defineField({ name: 'startingGoals', type: 'number', title: 'Starting goals', initialValue: 0 }),
    defineField({ name: 'finalScore', type: 'number', title: 'Final score (set on finalize)', initialValue: 0 }),
    defineField({
      name: 'players',
      type: 'array',
      title: 'Players',
      of: [{ type: 'object', name: 'poloPlayer', fields: playerFields }],
    }),
  ],
})

export const poloMatchSchema = defineType({
  name: 'poloMatch',
  title: 'Polo match (scoreboard)',
  type: 'document',
  icon: () => '🏇',
  groups: [
    { name: 'meta', title: 'Match info', default: true },
    { name: 'teams', title: 'Teams & rosters' },
    { name: 'live', title: 'Live state' },
    { name: 'log', title: 'Events & chukkers' },
  ],
  fields: [
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      group: 'meta',
    }),
    defineField({ name: 'eventName', title: 'Event name', type: 'string', group: 'meta' }),
    defineField({ name: 'clubName', title: 'Club name', type: 'string', group: 'meta' }),
    defineField({ name: 'title', title: 'Match title', type: 'string', validation: (Rule) => Rule.required(), group: 'meta' }),
    defineField({ name: 'matchDate', title: 'Date', type: 'date', group: 'meta' }),
    defineField({ name: 'matchTime', title: 'Time (display)', type: 'string', description: 'e.g. 1:00 PM', group: 'meta' }),
    defineField({ name: 'location', title: 'Location / field', type: 'string', group: 'meta' }),
    defineField({ name: 'matchType', title: 'Match type', type: 'string', group: 'meta' }),
    defineField({ name: 'fieldType', title: 'Field type', type: 'string', group: 'meta' }),
    defineField({
      name: 'numberOfChukkers',
      title: 'Number of chukkers',
      type: 'number',
      initialValue: 6,
      validation: (Rule) => Rule.required().min(1).max(8),
      group: 'meta',
    }),
    defineField({
      name: 'chukkerDurationSeconds',
      title: 'Chukker length (seconds)',
      type: 'number',
      initialValue: 420,
      group: 'meta',
    }),
    defineField({ name: 'overtimeEnabled', title: 'Overtime enabled', type: 'boolean', initialValue: false, group: 'meta' }),
    defineField({
      name: 'overtimeType',
      title: 'Overtime type',
      type: 'string',
      options: { list: [...OVERTIME_TYPE], layout: 'radio' },
      initialValue: 'none',
      group: 'meta',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: [...MATCH_STATUS], layout: 'dropdown' },
      initialValue: 'draft',
      group: 'live',
    }),
    defineField({ name: 'notes', title: 'Notes', type: 'text', rows: 4, group: 'meta' }),
    defineField({ name: 'publishedAt', title: 'Published live at', type: 'datetime', group: 'live' }),
    defineField({ name: 'finalizedAt', title: 'Finalized at', type: 'datetime', group: 'live' }),
    defineField({
      name: 'currentChukker',
      title: 'Current chukker',
      type: 'number',
      initialValue: 1,
      group: 'live',
    }),
    defineField({ name: 'liveClockRunning', title: 'Clock running', type: 'boolean', initialValue: false, group: 'live' }),
    defineField({
      name: 'liveClockAnchorIso',
      title: 'Clock anchor (ISO)',
      type: 'datetime',
      description: 'When clock is running, remaining ticks from this anchor.',
      group: 'live',
    }),
    defineField({
      name: 'liveClockSecondsAtAnchor',
      title: 'Seconds remaining at anchor (or frozen)',
      type: 'number',
      initialValue: 420,
      group: 'live',
    }),
    teamObject,
    awayTeamObject,
    defineField({
      name: 'officials',
      title: 'Officials',
      type: 'array',
      group: 'teams',
      of: [
        {
          type: 'object',
          name: 'matchOfficial',
          fields: [
            defineField({ name: 'name', type: 'string', title: 'Name' }),
            defineField({ name: 'role', type: 'string', title: 'Role' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'events',
      title: 'Match events',
      type: 'array',
      group: 'log',
      of: [
        {
          type: 'object',
          name: 'matchEvent',
          fields: [
            defineField({ name: 'chukkerNumber', type: 'number' }),
            defineField({
              name: 'eventType',
              type: 'string',
              options: {
                list: [
                  { title: 'Match started', value: 'match_started' },
                  { title: 'Clock started', value: 'clock_started' },
                  { title: 'Clock stopped', value: 'clock_stopped' },
                  { title: 'Clock edited', value: 'clock_edited' },
                  { title: 'Chukker started', value: 'chukker_started' },
                  { title: 'Chukker ended', value: 'chukker_ended' },
                  { title: 'Goal scored', value: 'goal_scored' },
                  { title: 'Penalty logged', value: 'penalty_logged' },
                  { title: 'Penalty goal', value: 'penalty_goal' },
                  { title: 'Injury logged', value: 'injury_logged' },
                  { title: 'Timeout', value: 'timeout_logged' },
                  { title: 'Score corrected', value: 'score_corrected' },
                  { title: 'Roster updated', value: 'roster_updated' },
                  { title: 'Note added', value: 'note_added' },
                  { title: 'Match finalized', value: 'match_finalized' },
                ],
              },
            }),
            defineField({ name: 'eventTimeSecondsRemaining', type: 'number', title: 'Clock (sec left) at event' }),
            defineField({
              name: 'teamSide',
              type: 'string',
              title: 'Team',
              options: { list: [{ title: 'Home', value: 'home' }, { title: 'Away', value: 'away' }] },
            }),
            defineField({ name: 'playerKey', type: 'string', title: 'Player _key' }),
            defineField({ name: 'penaltyType', type: 'string' }),
            defineField({ name: 'isConvertedPenalty', type: 'boolean' }),
            defineField({ name: 'scoreDelta', type: 'number' }),
            defineField({ name: 'note', type: 'text' }),
            defineField({ name: 'createdAt', type: 'datetime' }),
            defineField({ name: 'createdBy', type: 'string' }),
          ],
          preview: {
            select: { type: 'eventType', ch: 'chukkerNumber' },
            prepare({ type, ch }) {
              return { title: type ?? 'event', subtitle: ch != null ? `Ch ${ch}` : '' }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'chukkerScores',
      title: 'Score by chukker',
      type: 'array',
      group: 'log',
      of: [
        {
          type: 'object',
          name: 'chukkerScoreRow',
          fields: [
            defineField({ name: 'chukkerNumber', type: 'number' }),
            defineField({
              name: 'teamSide',
              type: 'string',
              options: { list: [{ title: 'Home', value: 'home' }, { title: 'Away', value: 'away' }] },
            }),
            defineField({ name: 'goalsInChukker', type: 'number' }),
            defineField({ name: 'runningTotal', type: 'number' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'title', status: 'status', date: 'matchDate' },
    prepare({ title, status, date }) {
      return { title: title ?? 'Match', subtitle: `${status ?? ''} ${date ?? ''}`.trim() }
    },
  },
})
