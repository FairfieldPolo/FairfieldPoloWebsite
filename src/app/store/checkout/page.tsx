import type { Metadata } from 'next'
import Link from 'next/link'

import { CheckoutPageClient } from '@/components/commerce/CheckoutPageClient'
import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Checkout — Fairfield Polo Club store.',
}

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        title="Checkout"
        subtitle="Payment is processed securely by your configured provider (e.g. Stripe via Medusa)."
        eyebrow="Shop"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-2xl">
          <div className="mb-6">
            <Link
              href="/store/cart"
              className="font-body text-sm text-polo-green hover:underline"
            >
              ← Back to cart
            </Link>
          </div>
          <CheckoutPageClient />
        </div>
      </section>
    </>
  )
}
