'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'

export function NewsletterSection() {
  const [email, setEmail]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [success, setSuccess]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error()
      setSuccess(true)
      toast.success('You\'re on the list!')
    } catch {
      toast.error('Something went wrong — please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-polo-charcoal section-pad-sm" id="newsletter">
      <div className="container-polo">
        <div className="max-w-2xl mx-auto text-center">
          <div className="gold-rule mx-auto mb-5" />
          <h2 className="heading-section text-polo-cream mb-3">
            Stay in the loop
          </h2>
          <p className="font-body text-polo-cream/60 mb-8">
            Game day alerts, schedule changes, rain delays, and season announcements —
            straight to your inbox. No spam, unsubscribe anytime.
          </p>

          {success ? (
            <div className="bg-polo-green/30 border border-polo-green rounded-sm px-6 py-5">
              <div className="font-display text-polo-gold text-lg font-semibold mb-1">
                You're on the list!
              </div>
              <p className="font-body text-sm text-polo-cream/70">
                Watch for your first email before the next game day.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-sm
                           font-body text-polo-cream placeholder:text-polo-cream/30
                           focus:outline-none focus:border-polo-gold focus:ring-1 focus:ring-polo-gold
                           transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-gold flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}

          <p className="font-body text-xs text-polo-cream/30 mt-4">
            We respect your inbox. Opt out anytime.
          </p>
        </div>
      </div>
    </section>
  )
}
