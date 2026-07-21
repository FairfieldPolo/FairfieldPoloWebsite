import { NextRequest, NextResponse } from 'next/server'

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message, turnstileToken } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET?.trim()
    if (TURNSTILE_SECRET) {
      const token = typeof turnstileToken === 'string' ? turnstileToken.trim() : ''
      if (!token) {
        return NextResponse.json({ error: 'Verification required' }, { status: 403 })
      }
      const remoteip =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') ||
        undefined
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          secret: TURNSTILE_SECRET,
          response: token,
          ...(remoteip ? { remoteip } : {}),
        }),
      })
      const verify = (await verifyRes.json()) as { success?: boolean }
      if (!verify.success) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 403 })
      }
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim()
    const CONTACT_EMAIL  = (process.env.CONTACT_EMAIL ?? 'wichitapoloclub@gmail.com').trim()
    // Must use an address on a domain verified in Resend (apex vs subdomain matters).
    const from =
      process.env.RESEND_FROM?.trim() ||
      'Fairfield Polo Club Website <noreply@updates.fairfieldpolo.com>'

    if (!RESEND_API_KEY) {
      // Dev fallback — log to console
      console.log('[Contact form]', { name, email, subject, message })
      return NextResponse.json({ ok: true })
    }

    const subj = typeof subject === 'string' ? subject : 'General question'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [CONTACT_EMAIL],
        // Resend REST API expects snake_case (see https://resend.com/docs/api-reference/emails/send-email)
        reply_to: email,
        subject: `[Contact] ${subj} — ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subj}`,
          '',
          message,
        ].join('\n'),
        html: `
          <p><strong>Name:</strong> ${escapeHtml(String(name))}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(String(email))}">${escapeHtml(String(email))}</a></p>
          <p><strong>Subject:</strong> ${escapeHtml(subj)}</p>
          <hr/>
          <p>${escapeHtml(String(message)).replace(/\n/g, '<br>')}</p>
        `,
      }),
    })

    const raw = await res.text()
    if (!res.ok) {
      console.error('[Resend error]', res.status, raw)
      let resendMessage: string | null = null
      try {
        const j = JSON.parse(raw) as { message?: string }
        if (j.message && typeof j.message === 'string' && j.message.length > 0 && j.message.length < 400) {
          resendMessage = j.message
        }
      } catch {
        /* ignore */
      }
      let clientMessage = resendMessage ?? 'Email delivery failed'
      if (!resendMessage) {
        if (res.status === 401) {
          clientMessage = 'Email service is not configured correctly.'
        } else if (res.status === 403) {
          clientMessage =
            'Sending was blocked (often the From address domain is not verified in Resend). Set RESEND_FROM to an address on your verified domain.'
        }
      }
      return NextResponse.json({ error: clientMessage }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact API]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
