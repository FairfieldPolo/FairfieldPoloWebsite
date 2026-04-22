'use client'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export function SignOutButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      className="btn-outline border-polo-cream/40 px-4 py-2 text-sm text-polo-cream"
      onClick={async () => {
        await fetch('/api/admin/session', { method: 'DELETE' })
        router.replace('/admin/login')
        router.refresh()
      }}
    >
      Sign out
    </button>
  )
}

export function DuplicateMatchButton({ id }: { id: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      className="rounded border border-polo-cream/30 px-3 py-1 text-xs text-polo-cream/90 hover:bg-white/10"
      onClick={async () => {
        const res = await fetch(`/api/admin/matches/${id}/duplicate`, {
          method: 'POST',
          credentials: 'include',
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          toast.error(data.error ?? 'Duplicate failed')
          return
        }
        toast.success('Duplicated')
        router.push(`/admin/matches/${data._id}/edit`)
        router.refresh()
      }}
    >
      Duplicate
    </button>
  )
}
