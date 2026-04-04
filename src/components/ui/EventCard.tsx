import Link from 'next/link'
import Image from 'next/image'
import { urlFor } from '@/lib/sanity'
import {
  formatEventDate,
  formatEventTime,
  formatShortDate,
  isEventToday,
  EVENT_TYPE_LABELS,
  EVENT_TYPE_COLORS,
} from '@/lib/utils'
import type { PoloEvent } from '@/types'

interface EventCardProps {
  event: PoloEvent
  variant?: 'default' | 'compact' | 'featured'
}

export function EventCard({ event, variant = 'default' }: EventCardProps) {
  const today   = isEventToday(event.date)
  const typeLabel = EVENT_TYPE_LABELS[event.eventType]
  const typeColor = EVENT_TYPE_COLORS[event.eventType]

  if (variant === 'compact') {
    return (
      <Link
        href={`/events/${event.slug.current}`}
        className="flex items-center gap-4 py-3 border-b border-polo-cream-dark last:border-0 hover:bg-polo-cream-dark/30 -mx-3 px-3 rounded transition-colors group"
      >
        {/* Date block */}
        <div className="flex-shrink-0 w-12 text-center">
          <div className="font-display text-xl font-bold text-polo-green leading-none">
            {formatShortDate(event.date).split(' ')[1]}
          </div>
          <div className="font-body text-xs uppercase text-polo-green/60 tracking-wide">
            {formatShortDate(event.date).split(' ')[0]}
          </div>
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="font-body font-medium text-polo-charcoal text-sm truncate group-hover:text-polo-green transition-colors">
            {event.title}
          </div>
          <div className="font-body text-xs text-gray-500 mt-0.5">
            {formatEventTime(event.date)}
            {event.admissionFee && ` · ${event.admissionFee}`}
          </div>
        </div>
        {/* Type badge */}
        <span className={`badge flex-shrink-0 text-[10px] ${typeColor}`}>
          {typeLabel}
        </span>
      </Link>
    )
  }

  if (variant === 'featured') {
    return (
      <Link
        href={`/events/${event.slug.current}`}
        className="group relative block rounded-sm overflow-hidden bg-polo-green min-h-[320px] hover:shadow-xl transition-shadow"
      >
        {/* Image */}
        {event.image ? (
          <Image
            src={urlFor(event.image).width(600).height(400).url()}
            alt={event.image.alt ?? event.title}
            fill
            className="object-cover opacity-60 group-hover:opacity-70 transition-opacity duration-300"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-polo-green to-polo-green-mid opacity-90" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-polo-charcoal/80 via-transparent to-transparent" />
        {/* Today pill */}
        {today && (
          <div className="absolute top-4 right-4 bg-polo-gold text-polo-charcoal font-body text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest animate-pulse">
            Today
          </div>
        )}
        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <span className={`badge mb-3 ${typeColor}`}>{typeLabel}</span>
          <h3 className="font-display text-xl font-bold text-polo-cream mb-1 leading-tight">
            {event.title}
          </h3>
          <p className="font-body text-sm text-polo-cream/75">
            {formatEventDate(event.date)} · {formatEventTime(event.date)}
          </p>
          {event.admissionFee && (
            <p className="font-body text-xs text-polo-gold mt-1">{event.admissionFee}</p>
          )}
        </div>
      </Link>
    )
  }

  // Default card
  return (
    <Link
      href={`/events/${event.slug.current}`}
      className="card group flex flex-col overflow-hidden hover:shadow-md transition-all"
    >
      {/* Image */}
      <div className="relative h-44 bg-polo-green overflow-hidden">
        {event.image ? (
          <Image
            src={urlFor(event.image).width(500).height(300).url()}
            alt={event.image.alt ?? event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-polo-green to-polo-green-mid">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" opacity="0.3">
              <circle cx="20" cy="20" r="18" stroke="#c9a84c" strokeWidth="1"/>
              <rect x="10" y="25" width="12" height="5" rx="1" fill="#c9a84c"/>
              <line x1="16" y1="25" x2="28" y2="10" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
        )}
        {today && (
          <div className="absolute top-3 right-3 bg-polo-gold text-polo-charcoal font-body text-xs font-bold px-2 py-0.5 rounded-sm uppercase tracking-widest">
            Today
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`badge ${typeColor}`}>{typeLabel}</span>
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="heading-card text-polo-green group-hover:text-polo-green-mid transition-colors mb-2 leading-snug">
          {event.title}
        </h3>
        <div className="flex items-center gap-1.5 font-body text-sm text-gray-500 mb-1">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
            <rect x="1" y="1.5" width="11" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
            <path d="M4 1v1.5M9 1v1.5M1 5h11" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          {formatEventDate(event.date)}
        </div>
        <div className="flex items-center gap-1.5 font-body text-sm text-gray-500 mb-3">
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="flex-shrink-0">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="currentColor" strokeWidth="1.1"/>
            <path d="M6.5 3.5V6.5l2 2" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
          </svg>
          {formatEventTime(event.date)}
          {event.admissionFee && (
            <span className="ml-auto font-medium text-polo-green">{event.admissionFee}</span>
          )}
        </div>
        {event.shortDescription && (
          <p className="font-body text-sm text-gray-600 line-clamp-2 flex-1">
            {event.shortDescription}
          </p>
        )}
        <div className="mt-4 pt-3 border-t border-polo-cream-dark">
          <span className="font-body text-sm font-medium text-polo-green group-hover:text-polo-green-light transition-colors">
            View details →
          </span>
        </div>
      </div>
    </Link>
  )
}
