'use client'

import { usePoloMatchLiveBySlug } from '@/components/matches/usePoloMatchLive'
import type { PoloMatchDocument } from '@/types/poloMatch'
import { PublicLiveScoreboard } from '@/components/matches/PublicLiveScoreboard'

export function PublicMatchClient({
  slug,
  initial,
}: {
  slug: string
  initial: PoloMatchDocument
}) {
  const live = usePoloMatchLiveBySlug(slug)
  const doc = live === undefined ? initial : live ?? initial
  return <PublicLiveScoreboard doc={doc} />
}
