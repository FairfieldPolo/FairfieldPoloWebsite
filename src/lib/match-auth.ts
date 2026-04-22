import { createHmac, timingSafeEqual, randomBytes } from 'node:crypto'

const COOKIE = 'fpc_match_admin'
const MAX_AGE_SEC = 60 * 60 * 12 // 12h

function secret(): string {
  const s = process.env.MATCH_ADMIN_SESSION_SECRET ?? process.env.MATCH_ADMIN_PASSWORD
  if (!s) throw new Error('Set MATCH_ADMIN_SESSION_SECRET or MATCH_ADMIN_PASSWORD')
  return s
}

function sign(payload: string): string {
  return createHmac('sha256', secret()).update(payload).digest('base64url')
}

export function createAdminSessionToken(): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC
  const nonce = randomBytes(8).toString('hex')
  const payload = JSON.stringify({ exp, nonce })
  const b64 = Buffer.from(payload, 'utf8').toString('base64url')
  const sig = sign(b64)
  return `${b64}.${sig}`
}

export function verifyAdminSessionToken(token: string | undefined): boolean {
  if (!token || !token.includes('.')) return false
  const [b64, sig] = token.split('.')
  if (!b64 || !sig) return false
  const expect = sign(b64)
  try {
    if (expect.length !== sig.length || !timingSafeEqual(Buffer.from(expect), Buffer.from(sig))) {
      return false
    }
  } catch {
    return false
  }
  let parsed: { exp?: number }
  try {
    parsed = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8')) as { exp?: number }
  } catch {
    return false
  }
  if (typeof parsed.exp !== 'number') return false
  if (parsed.exp < Math.floor(Date.now() / 1000)) return false
  return true
}

export function adminCookieName(): typeof COOKIE {
  return COOKIE
}

export function verifyAdminPassword(pw: string | undefined): boolean {
  const expected = process.env.MATCH_ADMIN_PASSWORD
  if (!expected) return false
  if (!pw) return false
  try {
    const a = Buffer.from(pw, 'utf8')
    const b = Buffer.from(expected, 'utf8')
    if (a.length !== b.length) return false
    return timingSafeEqual(a, b)
  } catch {
    return false
  }
}
