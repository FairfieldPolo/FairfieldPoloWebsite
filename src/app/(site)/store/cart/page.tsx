import type { Metadata } from 'next'
import Link from 'next/link'

import { CartPageClient } from '@/components/commerce/CartPageClient'
import { PageHero } from '@/components/ui/PageHero'
import { shopUrl } from '@/lib/site/shop-url'

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your Fairfield Polo Club cart.',
}

export default function CartPage() {
  return (
    <>
      <PageHero
        title="Cart"
        subtitle="Review your items before checkout."
        eyebrow="Shop"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-5xl">
          <div className="mb-6">
            <Link
              href={shopUrl('/store')}
              className="font-body text-sm text-polo-green hover:underline"
            >
              ← Continue shopping
            </Link>
          </div>
          <CartPageClient />
        </div>
      </section>
    </>
  )
}
