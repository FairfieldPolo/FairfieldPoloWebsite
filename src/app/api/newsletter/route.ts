import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

/** Datacenter segment after the last hyphen in the Mailchimp API key (e.g. us19, eu1). */
function mailchimpServerPrefix(apiKey: string): string {
  const fromEnv = process.env.MAILCHIMP_SERVER_PREFIX?.trim()
  if (fromEnv) return fromEnv
  const tail = apiKey.split('-').pop() ?? ''
  if (/^[a-z]{2}\d+$/i.test(tail)) return tail.toLowerCase()
  return 'us1'
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY
    const LIST_ID = process.env.MAILCHIMP_AUDIENCE_ID

    if (!API_KEY || !LIST_ID) {
      // Dev fallback
      console.log('[Newsletter signup]', email)
      return NextResponse.json({ ok: true })
    }

    // Mailchimp uses MD5 hash of lowercase email as member ID
    const emailHash = crypto
      .createHash('md5')
      .update(email.toLowerCase())
      .digest('hex')

    const SERVER = mailchimpServerPrefix(API_KEY)

    // PUT upserts — handles existing subscribers gracefully
    const res = await fetch(
      `https://${SERVER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${emailHash}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status_if_new: 'subscribed',
          status: 'subscribed',
          tags: ['website-signup'],
        }),
      }
    )

    if (!res.ok) {
      const bodyText = await res.text()
      let err: { title?: string; detail?: string } = {}
      try {
        err = JSON.parse(bodyText) as typeof err
      } catch {
        console.error('[Mailchimp error]', res.status, bodyText.slice(0, 500))
      }
      console.error('[Mailchimp error]', res.status, err.title ?? err.detail ?? bodyText.slice(0, 200))
      if (err.title === 'Member Exists') {
        return NextResponse.json({ ok: true })
      }
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Newsletter API]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
