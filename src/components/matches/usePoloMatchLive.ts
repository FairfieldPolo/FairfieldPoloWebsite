'use client'

import { useEffect, useState } from 'react'
import { createSanityBrowserClient } from '@/lib/sanity-browser'
import { POLO_MATCH_BY_SLUG_QUERY, POLO_MATCH_BY_ID_QUERY } from '@/lib/match-queries'
import type { PoloMatchDocument } from '@/types/poloMatch'

export function usePoloMatchLiveBySlug(slug: string | undefined): PoloMatchDocument | null | undefined {
  const [doc, setDoc] = useState<PoloMatchDocument | null | undefined>(undefined)

  useEffect(() => {
    if (!slug) {
      setDoc(undefined)
      return
    }
    const client = createSanityBrowserClient()
    let cancelled = false

    client
      .fetch<PoloMatchDocument | null>(POLO_MATCH_BY_SLUG_QUERY, { slug })
      .then((d) => {
        if (!cancelled) setDoc(d)
      })
      .catch(() => {
        if (!cancelled) setDoc(null)
      })

    const sub = client
      .listen(`*[_type == "poloMatch" && slug.current == $slug]`, { slug })
      .subscribe(() => {
        void client.fetch<PoloMatchDocument | null>(POLO_MATCH_BY_SLUG_QUERY, { slug }).then(setDoc)
      })

    return () => {
      cancelled = true
      sub.unsubscribe()
    }
  }, [slug])

  return doc
}

export function usePoloMatchLiveById(id: string | undefined): PoloMatchDocument | null | undefined {
  const [doc, setDoc] = useState<PoloMatchDocument | null | undefined>(undefined)

  useEffect(() => {
    if (!id) {
      setDoc(undefined)
      return
    }
    const client = createSanityBrowserClient()
    let cancelled = false

    client
      .fetch<PoloMatchDocument | null>(POLO_MATCH_BY_ID_QUERY, { id })
      .then((d) => {
        if (!cancelled) setDoc(d)
      })
      .catch(() => {
        if (!cancelled) setDoc(null)
      })

    const sub = client
      .listen(`*[_type == "poloMatch" && _id == $id]`, { id })
      .subscribe(() => {
        void client.fetch<PoloMatchDocument | null>(POLO_MATCH_BY_ID_QUERY, { id }).then(setDoc)
      })

    return () => {
      cancelled = true
      sub.unsubscribe()
    }
  }, [id])

  return doc
}
