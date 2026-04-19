'use client'

import { useState } from 'react'

/**
 * Collects email and initializes a Medusa payment session (Stripe module, PayPal module, etc.).
 * Card/bank data stays with the payment provider — not handled in this form.
 *
 * Embed Stripe Payment Element on this page after init if you expose client_secret from
 * payment_collection — see README.
 */
export function CheckoutPageClient() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  async function startCheckout(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/commerce/checkout/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined }),
      })
      const data = await res.json()
      if (!data.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : 'Checkout failed')
      }
      setInitialized(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed')
    } finally {
      setLoading(false)
    }
  }

  if (initialized) {
    return (
      <div className="max-w-lg space-y-4 font-body">
        <p className="text-polo-charcoal">
          Payment session is ready. Complete payment through your Medusa-configured provider
          (e.g. Stripe). You can embed{' '}
          <a
            href="https://docs.medusajs.com/resources/storefront-development/checkout/payment"
            className="text-polo-green underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Stripe Elements
          </a>{' '}
          here using the client secret from the payment session returned by{' '}
          <code className="text-sm bg-polo-cream px-1 rounded">/api/commerce/checkout/init</code>.
        </p>
        <p className="text-sm text-gray-500">
          After the provider confirms payment, call{' '}
          <code className="text-xs bg-polo-cream px-1 rounded">POST /api/commerce/checkout/complete</code>{' '}
          to finalize the order in Medusa.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={startCheckout} className="max-w-md space-y-4">
      <div>
        <label htmlFor="checkout-email" className="block font-body text-sm text-gray-600 mb-1">
          Email (for order updates)
        </label>
        <input
          id="checkout-email"
          type="email"
          autoComplete="email"
          className="input-polo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}
      <button type="submit" className="btn-gold w-full justify-center" disabled={loading}>
        {loading ? 'Continuing…' : 'Continue to payment'}
      </button>
      <p className="text-xs text-gray-500 leading-relaxed">
        Configure Stripe or PayPal in Medusa Admin. Legal/compliance for any convenience fee
        is your responsibility — see env template and service fee comments.
      </p>
    </form>
  )
}
