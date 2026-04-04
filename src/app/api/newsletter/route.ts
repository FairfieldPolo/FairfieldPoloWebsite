import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

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

    const API_KEY   = process.env.MAILCHIMP_API_KEY
    const LIST_ID   = process.env.MAILCHIMP_AUDIENCE_ID
    const SERVER    = process.env.MAILCHIMP_SERVER_PREFIX ?? 'us1'

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
      const err = await res.json()
      console.error('[Mailchimp error]', err)
      // If already subscribed, still return ok
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
