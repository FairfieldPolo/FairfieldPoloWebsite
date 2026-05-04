import type { SiteSettings } from '@/types'

const D = {
  when: 'Open to the public every Sunday at 1pm.',
  narrative:
    'One of the oldest USPA clubs in America. Watch world-class polo every Sunday at 1pm — open to the public, free to attend.',
  gates:      'Gates open at noon for Sunday games.',
  gatesStat:  'Gates open at noon',
  timeH3:     'Sundays at 1:00 PM — Free Admission',
  timeContact: 'Sundays at 1:00 PM',
  timeDetail:  'Every Sunday at 1:00 PM (spring/summer)',
  statTime:   'Sun 1pm',
  seo:        'Watch live polo every Sunday at 1pm in Haysville, Kansas.',
  noEvents:   'Check back soon — we play every Sunday at 1pm.',
  emptyEvents: 'We play every Sunday at 1pm — check back soon for the season schedule.',
  emptySchedule: 'We play every Sunday at 1pm during the season.',
  getInvolved:
    'Come out any Sunday at 1pm. Free admission, family friendly, bring lawn chairs or blankets. The field is wide open.',
  scheduleCard:
    'Open matches are held every Sunday at 1:00 PM throughout the spring and summer season. Gates open at noon. Free admission — no tickets required. Bring chairs, blankets, and the family.',
  weatherNote:
    "We don't play when it's raining or the field is too muddy. Check for updates on this site or on Facebook before you head out.",
} as const

const FOOTER_LEAD = 'One of the oldest USPA clubs in the country.'

export type PublicPoloCopy = {
  when: string
  /** About strip, “Open to all” value card: ties to public schedule from CMS. */
  aboutOpenToAllBody: string
  footerParagraph: string
  narrative: string
  gates: string
  gatesStat: string
  timeCallout: string
  timeContact: string
  timeDetail: string
  statTime: string
  seoSchedule: string
  noEvents: string
  emptyEvents: string
  emptySchedule: string
  getInvolved: string
  scheduleCard: string
  eventsStripSubtitle: string
  pageHeroEventsSubtitle: string
  schedulePageHeroSubtitle: string
  weatherNote: string
}

/** Default meta + OG description; uses `seoSchedule` and `when` from CMS. */
export function rootLayoutDescription(polo: PublicPoloCopy): string {
  return (
    'One of the oldest USPA polo clubs in America, founded 1931. ' +
    `${polo.seoSchedule} ` +
    'Open to the public — bring the family.'
  )
}

export function openGraphDescription(polo: PublicPoloCopy): string {
  return `Live polo. Founded 1931. ${polo.when.replace(/\s*\.\s*$/, '')}.`
}

export function getPublicPoloCopy(s: SiteSettings | null | undefined): PublicPoloCopy {
  const when = s?.publicPoloWhen?.trim() || D.when
  const whenSentence = when.endsWith('.') ? when : `${when}.`
  return {
    when,
    aboutOpenToAllBody: `${whenSentence} Bring the whole family.`,
    footerParagraph: `${FOOTER_LEAD} ${whenSentence}`,
    narrative:  s?.publicPoloNarrative?.trim()  || D.narrative,
    gates:      s?.publicGates?.trim()         || D.gates,
    gatesStat:  s?.publicGatesStat?.trim()     || D.gatesStat,
    timeCallout: s?.publicPoloTimeCallout?.trim()   || D.timeH3,
    timeContact: s?.publicPoloTimeContact?.trim()   || D.timeContact,
    timeDetail:  s?.publicPoloTimeDetail?.trim()   || D.timeDetail,
    statTime:   s?.publicPoloStatTime?.trim()     || D.statTime,
    seoSchedule: s?.publicPoloSeo?.trim()        || D.seo,
    noEvents:   s?.publicPoloNoEvents?.trim()     || D.noEvents,
    emptyEvents: s?.publicPoloEmptyEvents?.trim()  || D.emptyEvents,
    emptySchedule: s?.publicPoloEmptySchedule?.trim() || D.emptySchedule,
    getInvolved:  s?.publicPoloGetInvolved?.trim()    || D.getInvolved,
    scheduleCard: s?.publicPoloScheduleCard?.trim()   || D.scheduleCard,
    eventsStripSubtitle: `${when} Special events throughout the season.`,
    pageHeroEventsSubtitle: `${when} Special events throughout the season.`,
    schedulePageHeroSubtitle: `Every match, tournament, and special event this season. ${
      s?.publicGates?.trim() || D.gates
    }`,
    weatherNote: s?.publicPoloWeatherNote?.trim() || D.weatherNote,
  }
}
