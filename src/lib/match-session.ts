import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminSessionToken, adminCookieName } from '@/lib/match-auth'

export async function getAdminSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(adminCookieName())?.value
}

export async function requireAdminSession(): Promise<void> {
  const t = await getAdminSessionToken()
  if (!verifyAdminSessionToken(t)) {
    const path = (await headers()).get('x-pathname') ?? '/admin/matches'
    const next = path.startsWith('/admin') ? path : '/admin/matches'
    redirect(`/admin/login?next=${encodeURIComponent(next)}`)
  }
}
