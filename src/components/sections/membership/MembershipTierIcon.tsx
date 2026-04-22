type Kind = 'social' | 'beginner' | 'arena' | 'field' | 'family'

const common = 'text-polo-gold flex-shrink-0'

/** Small decorative icons for membership tier cards. */
export function MembershipTierIcon({ kind, className = 'w-10 h-10' }: { kind: Kind; className?: string }) {
  const cn = [common, className].join(' ')

  switch (kind) {
    case 'social':
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="14" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
          <path d="M6 32v-1c0-3.3 2.7-6 6-6h4c3.3 0 6 2.7 6 6v1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="27" cy="11" r="3.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M20 18c2.5-2.5 5.5-3 7.5-3 4 0 7.5 2.2 7.5 5.5V32" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )
    case 'beginner':
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <path
            d="M12 8l3 2 6-1 2 3-1 4 2 3-4 2-2-2-2 1-1-2 2-3-2-2.5-2-1.5Z"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <line x1="8" y1="30" x2="32" y2="30" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M18 20v4M20 20v4M25 20v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
    case 'arena':
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <rect x="5" y="10" width="30" height="20" rx="1" stroke="currentColor" strokeWidth="1.4" />
          <line x1="5" y1="20" x2="35" y2="20" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
          <circle cx="20" cy="20" r="2.5" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      )
    case 'field':
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <ellipse cx="20" cy="22" rx="16" ry="7" stroke="currentColor" strokeWidth="1.3" />
          <path d="M4 20h32M20 8v8M12 20v6M20 20v6M28 20v6" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.7" />
        </svg>
      )
    case 'family':
      return (
        <svg className={cn} viewBox="0 0 40 40" fill="none" aria-hidden="true">
          <circle cx="12" cy="11" r="3" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="24" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M5 32v-1c0-2.5 2-4.5 4.5-4.5h5c1.2 0 2.2.4 3 1.1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M20 32v-1c0-2.2 1.5-3.5 3.5-3.5h3c2 0 3.5 1.3 3.5 3.5v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      )
  }
}
