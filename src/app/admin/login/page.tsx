'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

function AdminLoginPageInner() {
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const router = useRouter()
  const search = useSearchParams()
  const next = search.get('next') && search.get('next')!.startsWith('/admin') ? search.get('next')! : '/admin/matches'

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        toast.error('Invalid password')
        return
      }
      toast.success('Signed in')
      router.replace(next)
      router.refresh()
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-sm rounded-xl border border-white/10 bg-polo-green/40 p-8">
      <h1 className="font-display text-2xl text-polo-cream">Match console login</h1>
      <p className="mt-2 text-sm text-polo-cream/70">Enter the club match admin password.</p>
      <form onSubmit={(e) => void submit(e)} className="mt-6 space-y-4">
        <label className="block text-sm font-medium">
          Password
          <input
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded border border-white/20 bg-polo-charcoal px-3 py-2 text-polo-cream"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit" disabled={busy} className="btn-gold w-full">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm rounded-xl border border-white/10 bg-polo-green/40 p-8 text-polo-cream/70">Loading login…</div>}>
      <AdminLoginPageInner />
    </Suspense>
  )
}
