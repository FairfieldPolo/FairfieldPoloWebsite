import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Schedule Calendar',
  description: 'Browse the Fairfield Polo Club calendar of upcoming matches and events.',
}

export default function ScheduleCalendarPage() {
  redirect('/events')
}
