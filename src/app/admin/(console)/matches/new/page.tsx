'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewMatchPage() {
  const router = useRouter()
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/admin/matches', { method: 'POST', credentials: 'include' })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(data.error ?? res.statusText)
        if (!cancelled && data._id) router.replace(`/admin/matches/${data._id}/edit`)
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Failed to create match')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <div className="text-polo-cream">
      <h1 className="font-display text-2xl">Creating match…</h1>
      {err && <p className="mt-4 text-red-300">{err}</p>}
    </div>
  )
}
