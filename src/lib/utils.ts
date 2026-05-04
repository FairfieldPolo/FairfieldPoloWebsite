import { format, formatDistanceToNow, isPast, isToday } from 'date-fns'
import type { EventType, SponsorTier } from '@/types'
import { DEFAULT_CLUB_MAPS_QUERY } from '@/lib/site/location'

// ─── Date helpers ──────────────────────────────────────────────
export function formatEventDate(dateStr: string): string {
  return format(new Date(dateStr), 'EEEE, MMMM d, yyyy')
}

export function formatEventTime(dateStr: string): string {
  return format(new Date(dateStr), 'h:mm a')
}

export function formatShortDate(dateStr: string): string {
  return format(new Date(dateStr), 'MMM d')
}

export function formatMonthYear(dateStr: string): string {
  return format(new Date(dateStr), 'MMMM yyyy')
}

export function timeUntil(dateStr: string): string {
  return formatDistanceToNow(new Date(dateStr), { addSuffix: true })
}

export function isEventPast(dateStr: string): boolean {
  return isPast(new Date(dateStr))
}

export function isEventToday(dateStr: string): boolean {
  return isToday(new Date(dateStr))
}

// ─── Event helpers ─────────────────────────────────────────────
export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  match:      'Match',
  charity:    'Charity Event',
  tournament: 'Tournament',
  private:    'Private Event',
  social:     'Social',
  practice:   'Practice',
  lesson:     'Lesson',
}

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  match:      'bg-polo-green text-polo-cream',
  charity:    'bg-polo-gold text-polo-charcoal',
  tournament: 'bg-polo-brown text-polo-cream',
  private:    'bg-gray-500 text-white',
  social:     'bg-indigo-800 text-polo-cream',
  practice:   'bg-polo-green-mid text-polo-cream',
  lesson:     'bg-sky-800 text-polo-cream',
}

// ─── Sponsor helpers ───────────────────────────────────────────
export const SPONSOR_TIER_LABELS: Record<SponsorTier, string> = {
  title:      'Title Sponsor',
  gold:       'Gold Sponsor',
  silver:     'Silver Sponsor',
  supporting: 'Supporting Sponsor',
}

export const SPONSOR_TIER_ORDER: Record<SponsorTier, number> = {
  title: 0, gold: 1, silver: 2, supporting: 3,
}

// ─── iCal generation ──────────────────────────────────────────
export function generateIcalEvent(event: {
  title: string
  date: string
  endDate?: string
  description?: string
  location?: string
}): string {
  const start = new Date(event.date)
  const end   = event.endDate ? new Date(event.endDate) : new Date(start.getTime() + 2 * 60 * 60 * 1000)
  const fmt   = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Fairfield Polo Club//EN',
    'BEGIN:VEVENT',
    `DTSTART:${fmt(start)}`,
    `DTEND:${fmt(end)}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}` : '',
    `LOCATION:${event.location ?? DEFAULT_CLUB_MAPS_QUERY}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean).join('\r\n')
}

// ─── Class name helper ─────────────────────────────────────────
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
