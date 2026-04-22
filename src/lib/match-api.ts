import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { verifyAdminSessionToken, adminCookieName } from '@/lib/match-auth'

export function adminUnauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export async function requireAdminApi(): Promise<Response | null> {
  const token = (await cookies()).get(adminCookieName())?.value
  if (!verifyAdminSessionToken(token)) {
    return adminUnauthorized()
  }
  return null
}
