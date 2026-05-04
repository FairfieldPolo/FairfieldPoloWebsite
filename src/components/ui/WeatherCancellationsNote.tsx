import Link from 'next/link'

const LINKABLE = /(\bthis site\b|\bhere\b|\bFacebook\b)/gi

type Props = {
  text: string
  facebookUrl?: string | null
  className?: string
}

/**
 * Renders site copy about rain/mud. Words “this site” and “here” link to /events; “Facebook”
 * links to `facebookUrl` when set (configure in Site settings).
 */
export function WeatherCancellationsNote({ text, facebookUrl, className = '' }: Props) {
  const parts = text.split(LINKABLE)

  return (
    <div
      className={[
        'flex gap-3 rounded-sm border border-amber-200/80 bg-amber-50/95',
        'px-4 py-3 md:px-5 md:py-3.5',
        className,
      ].join(' ')}
      role="status"
    >
      <div className="mt-0.5 flex-shrink-0 text-amber-700/90" aria-hidden="true">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path
            d="M12 3v2M12 19v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M3 12h2M19 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
            strokeLinecap="round"
          />
          <path
            d="M8 14a4 4 0 018 0M6 16h12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="font-body text-sm text-polo-charcoal/90 leading-relaxed [text-wrap:pretty]">
        {parts.map((part, i) => {
          const lower = part.toLowerCase()
          if (lower === 'this site' || lower === 'here') {
            return (
              <Link
                key={`${i}-${part}`}
                href="/events"
                className="font-medium text-polo-green underline decoration-polo-green/30 underline-offset-2 hover:decoration-polo-green"
              >
                {part}
              </Link>
            )
          }
          if (lower === 'facebook') {
            return facebookUrl ? (
              <a
                key={`${i}-${part}`}
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-polo-green underline decoration-polo-green/30 underline-offset-2 hover:decoration-polo-green"
              >
                {part}
              </a>
            ) : (
              <span key={`${i}-${part}`}>{part}</span>
            )
          }
          return <span key={`${i}-${part}`}>{part}</span>
        })}
      </p>
    </div>
  )
}
