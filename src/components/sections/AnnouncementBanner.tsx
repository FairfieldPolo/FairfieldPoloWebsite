'use client'

import { useState } from 'react'
import type { Announcement } from '@/types'

const TYPE_STYLES = {
  urgent:   'bg-red-700 text-white',
  weather:  'bg-polo-brown text-polo-cream',
  schedule: 'bg-polo-green-mid text-polo-cream',
  general:  'bg-polo-green text-polo-cream',
}

const TYPE_ICONS = {
  urgent:   '⚠',
  weather:  '☁',
  schedule: '📅',
  general:  'ℹ',
}

export function AnnouncementBanner({ announcement }: { announcement: Announcement }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const style = TYPE_STYLES[announcement.type] ?? TYPE_STYLES.general
  const icon  = TYPE_ICONS[announcement.type]  ?? TYPE_ICONS.general

  return (
    <div
      className={`relative z-40 w-full mt-16 md:mt-20 ${style}`}
      role="alert"
    >
      <div className="container-polo">
        <div className="flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-base flex-shrink-0" aria-hidden="true">{icon}</span>
            <p className="font-body text-sm font-medium truncate">
              {announcement.title}
            </p>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="flex-shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity"
            aria-label="Dismiss announcement"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
