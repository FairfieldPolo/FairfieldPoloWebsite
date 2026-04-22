import { NextResponse } from 'next/server'
import {
  adminCookieName,
  createAdminSessionToken,
  verifyAdminPassword,
} from '@/lib/match-auth'

export async function POST(req: Request) {
  let body: { password?: string }
  try {
    body = (await req.json()) as { password?: string }
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }
  if (!verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  const token = createAdminSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(adminCookieName(), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(adminCookieName(), '', { path: '/', maxAge: 0 })
  return res
}
