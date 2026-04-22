import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/match-api'
import { getSanityWriteClient } from '@/lib/sanity-write'
import { POLO_MATCH_BY_ID_QUERY } from '@/lib/match-queries'
import type { PoloMatchDocument } from '@/types/poloMatch'
import { applyMatchAction, type MatchSetupInput } from '@/lib/match-actions'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(_req: Request, ctx: Ctx) {
  const deny = await requireAdminApi()
  if (deny) return deny
  const { id } = await ctx.params
  const doc = await getSanityWriteClient().fetch<PoloMatchDocument | null>(POLO_MATCH_BY_ID_QUERY, { id })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(doc)
}

export async function PATCH(req: Request, ctx: Ctx) {
  const deny = await requireAdminApi()
  if (deny) return deny
  const { id } = await ctx.params
  const client = getSanityWriteClient()
  const doc = await client.fetch<PoloMatchDocument | null>(POLO_MATCH_BY_ID_QUERY, { id })
  if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  let body: { setup: MatchSetupInput }
  try {
    body = (await req.json()) as { setup: MatchSetupInput }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const result = applyMatchAction(doc, { action: 'save_draft', setup: body.setup }, 'admin')
  if ('error' in result) {
    return NextResponse.json({ error: result.error }, { status: result.status ?? 400 })
  }

  await client.patch(id).set(result.patch).commit()
  const next = await client.fetch<PoloMatchDocument>(POLO_MATCH_BY_ID_QUERY, { id })
  return NextResponse.json(next)
}
