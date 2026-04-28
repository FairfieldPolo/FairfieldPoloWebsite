import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Shop',
  description:
    'Fairfield Polo Club shop placeholder for future apparel, hats, and gifts.',
}

const SHOP_ORIGIN = process.env.NEXT_PUBLIC_SHOP_URL?.trim().replace(/\/$/, '') || 'https://shop.fairfieldpolo.com'

export default function ShopPage() {
  return (
    <>
      <PageHero
        title="Shop"
        subtitle="Fairfield apparel, hats, and gifts will live on the future shop site."
        eyebrow="Coming Soon"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-3xl">
          <div className="card p-7">
            <div className="gold-rule mb-5" />
            <h2 className="heading-section text-polo-green mb-4">Future external store</h2>
            <p className="font-body text-sm text-gray-600 leading-relaxed">
              The main Fairfield site stays focused on public marketing and club information. When
              the store is ready, shop traffic can move to the dedicated shop subdomain without
              adding full commerce scope here.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={SHOP_ORIGIN} className="btn-gold">
                Visit shop site
              </a>
              <Link href="/contact" className="btn-outline">
                Ask about merchandise
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
