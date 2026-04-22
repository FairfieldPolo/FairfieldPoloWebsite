import type { PoloMatchDocument } from '@/types/poloMatch'
import { MatchStatusBadge } from '@/components/matches/MatchStatusBadge'
import { LiveClockDisplay } from '@/components/matches/LiveClockDisplay'
import { ChukkerIndicator } from '@/components/matches/ChukkerIndicator'

export function ScoreboardHeader({
  doc,
  showClock,
  largeClock,
}: {
  doc: PoloMatchDocument
  showClock?: boolean
  largeClock?: boolean
}) {
  return (
    <header className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          {doc.eventName && (
            <p className="text-sm font-medium uppercase tracking-wide text-polo-green-mid">{doc.eventName}</p>
          )}
          <h1 className="font-display text-2xl text-polo-green sm:text-3xl">{doc.title}</h1>
          {(doc.clubName || doc.location) && (
            <p className="text-sm text-polo-charcoal/80">
              {[doc.clubName, doc.location].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <MatchStatusBadge status={doc.status} />
      </div>
      {showClock && (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl bg-white/80 px-4 py-6 shadow-inner sm:flex-row sm:gap-8">
          <ChukkerIndicator doc={doc} />
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-polo-green-mid">Clock</p>
            <LiveClockDisplay doc={doc} large={largeClock} />
            <p className="text-xs text-polo-charcoal/70">{doc.liveClockRunning ? 'Running' : 'Stopped'}</p>
          </div>
        </div>
      )}
    </header>
  )
}
