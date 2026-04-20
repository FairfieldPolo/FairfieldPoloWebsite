import { NextRequest, NextResponse } from 'next/server'
import { sanityFetch } from '@/lib/sanity'
import { EVENT_BY_SLUG_QUERY } from '@/lib/queries'
import type { PoloEvent } from '@/types'
import { generateIcalEvent } from '@/lib/utils'
import { eventLocationForCalendar } from '@/lib/site/event-location'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')

  if (!slug) {
    return NextResponse.json({ error: 'slug required' }, { status: 400 })
  }

  const event = await sanityFetch<PoloEvent | null>(EVENT_BY_SLUG_QUERY, { slug })

  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  }

  const ical = generateIcalEvent({
    title:       event.title,
    date:        event.date,
    endDate:     event.endDate,
    description: event.shortDescription,
    location:    eventLocationForCalendar(event),
  })

  return new NextResponse(ical, {
    status: 200,
    headers: {
      'Content-Type':        'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${slug}.ics"`,
      'Cache-Control':       'no-cache',
    },
  })
}
