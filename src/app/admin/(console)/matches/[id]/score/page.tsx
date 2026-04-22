import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getSanityWriteClient } from '@/lib/sanity-write'
import { POLO_MATCH_BY_ID_QUERY } from '@/lib/match-queries'
import type { PoloMatchDocument } from '@/types/poloMatch'
import { AdminScoringConsole } from '@/components/matches/AdminScoringConsole'

type Props = { params: Promise<{ id: string }> }

export default async function ScoreMatchPage({ params }: Props) {
  const { id } = await params
  const doc = await getSanityWriteClient().fetch<PoloMatchDocument | null>(POLO_MATCH_BY_ID_QUERY, { id })
  if (!doc) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-polo-cream">Live scoring</h1>
        <div className="flex flex-wrap gap-2">
          <Link href={`/matches/${doc.slug?.current ?? ''}`} className="btn-outline border-polo-cream/40 px-4 py-2 text-sm text-polo-cream">
            Public page
          </Link>
          <Link href={`/admin/matches/${id}/edit`} className="btn-outline border-polo-cream/40 px-4 py-2 text-sm text-polo-cream">
            Edit setup
          </Link>
          <Link href="/admin/matches" className="btn-outline border-polo-cream/40 px-4 py-2 text-sm text-polo-cream">
            All matches
          </Link>
        </div>
      </div>
      <div className="rounded-xl border border-white/10 bg-polo-cream p-6 text-polo-charcoal">
        <AdminScoringConsole matchId={id} />
      </div>
    </div>
  )
}
