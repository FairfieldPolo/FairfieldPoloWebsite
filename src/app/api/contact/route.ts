import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    const RESEND_API_KEY   = process.env.RESEND_API_KEY
    const CONTACT_EMAIL    = process.env.CONTACT_EMAIL ?? 'wichitapoloclub@gmail.com'

    if (!RESEND_API_KEY) {
      // Dev fallback — log to console
      console.log('[Contact form]', { name, email, subject, message })
      return NextResponse.json({ ok: true })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'Fairfield Polo Club Website <noreply@fairfieldpolo.com>',
        to:      [CONTACT_EMAIL],
        replyTo: email,
        subject: `[Contact] ${subject} — ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Subject: ${subject}`,
          '',
          message,
        ].join('\n'),
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr/>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[Resend error]', err)
      return NextResponse.json({ error: 'Email delivery failed' }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[Contact API]', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
