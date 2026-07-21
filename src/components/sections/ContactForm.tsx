'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'
import toast from 'react-hot-toast'

type FormState = {
  name: string
  email: string
  subject: string
  message: string
}

const SUBJECTS = [
  'General question',
  'Upcoming events',
  'Membership',
  'Lessons / getting started',
  'Sponsorship',
  'Private event / party',
  'Media / press',
  'Other',
]

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

declare global {
  interface Window {
    onContactTurnstileSuccess?: (token: string) => void
    onContactTurnstileExpire?: () => void
    turnstile?: {
      reset: (widgetId?: string) => void
    }
  }
}

export function ContactForm() {
  const [form, setForm]       = useState<FormState>({ name: '', email: '', subject: SUBJECTS[0], message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [turnstileToken, setTurnstileToken] = useState('')

  useEffect(() => {
    window.onContactTurnstileSuccess = (token: string) => setTurnstileToken(token)
    window.onContactTurnstileExpire = () => setTurnstileToken('')
    return () => {
      delete window.onContactTurnstileSuccess
      delete window.onContactTurnstileExpire
    }
  }, [])

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      toast.error('Please complete the verification check.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, turnstileToken }),
      })
      const data = (await res.json().catch(() => null)) as { error?: unknown } | null
      if (!res.ok) {
        const apiErr =
          data && typeof data.error === 'string' && data.error.length > 0 && data.error.length < 400
            ? data.error
            : null
        toast.error(apiErr ?? 'Something went wrong — please try emailing us directly.')
        setTurnstileToken('')
        window.turnstile?.reset()
        return
      }
      setSent(true)
      setTurnstileToken('')
      toast.success('Message sent! We\'ll be in touch soon.')
    } catch {
      toast.error('Something went wrong — please try emailing us directly.')
      setTurnstileToken('')
      window.turnstile?.reset()
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <div className="bg-polo-green/10 border border-polo-green/20 rounded-sm p-8 text-center">
        <div className="font-display text-2xl text-polo-green font-bold mb-2">Message received!</div>
        <p className="font-body text-gray-600">
          Thanks for reaching out. We'll get back to you within a day or two.
        </p>
        <button
          onClick={() => {
            setSent(false)
            setForm({ name: '', email: '', subject: SUBJECTS[0], message: '' })
            setTurnstileToken('')
          }}
          className="mt-4 font-body text-sm text-polo-green/60 hover:text-polo-green underline-offset-2 hover:underline"
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <>
      {TURNSTILE_SITE_KEY ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-body text-sm font-medium text-polo-charcoal mb-1.5 block">
              Your name <span className="text-polo-green">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={set('name')}
              required
              placeholder="Jane Smith"
              className="input-polo"
            />
          </div>
          <div>
            <label className="font-body text-sm font-medium text-polo-charcoal mb-1.5 block">
              Email address <span className="text-polo-green">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={set('email')}
              required
              placeholder="jane@example.com"
              className="input-polo"
            />
          </div>
        </div>

        <div>
          <label className="font-body text-sm font-medium text-polo-charcoal mb-1.5 block">
            What's this about?
          </label>
          <select
            value={form.subject}
            onChange={set('subject')}
            className="input-polo"
          >
            {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="font-body text-sm font-medium text-polo-charcoal mb-1.5 block">
            Message <span className="text-polo-green">*</span>
          </label>
          <textarea
            value={form.message}
            onChange={set('message')}
            required
            rows={5}
            placeholder="Tell us what you'd like to know..."
            className="input-polo resize-none"
          />
        </div>

        {TURNSTILE_SITE_KEY ? (
          <div
            className="cf-turnstile"
            data-sitekey={TURNSTILE_SITE_KEY}
            data-action="turnstile-spin-v2"
            data-callback="onContactTurnstileSuccess"
            data-expired-callback="onContactTurnstileExpire"
          />
        ) : null}

        <button
          type="submit"
          disabled={loading || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending…' : 'Send message'}
        </button>

        <p className="font-body text-xs text-gray-400 text-center">
          Or email us directly at{' '}
          <a href="mailto:wichitapoloclub@gmail.com" className="text-polo-green hover:underline">
            wichitapoloclub@gmail.com
          </a>
        </p>
      </form>
    </>
  )
}
