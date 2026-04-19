import type { Metadata } from 'next'

import { ProductCard } from '@/components/commerce/ProductCard'
import { StoreNotConfigured } from '@/components/commerce/StoreNotConfigured'
import { PageHero } from '@/components/ui/PageHero'
import { getStoreCurrencyCode, listStoreProducts } from '@/lib/commerce/products'
import { isMedusaConfigured } from '@/lib/medusa/server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Club Store',
  description:
    'Shop Fairfield Polo Club merchandise — apparel, accessories, and polo gear.',
}

export default async function StorePage() {
  if (!isMedusaConfigured()) {
    return (
      <>
        <PageHero
          title="Club Store"
          subtitle="Official Fairfield Polo Club merchandise. Wear your colors."
          eyebrow="Shop"
        />
        <StoreNotConfigured />
      </>
    )
  }

  const data = await listStoreProducts()
  if (!data?.products.length) {
    return (
      <>
        <PageHero
          title="Club Store"
          subtitle="Official Fairfield Polo Club merchandise. Wear your colors."
          eyebrow="Shop"
        />
        <section className="section-cream section-pad">
          <div className="container-polo text-center font-body text-gray-600">
            No products yet. Add products in Medusa Admin.
          </div>
        </section>
      </>
    )
  }

  const currencyCode = await getStoreCurrencyCode(data.regionId)

  return (
    <>
      <PageHero
        title="Club Store"
        subtitle="Official Fairfield Polo Club merchandise. Wear your colors."
        eyebrow="Shop"
      />
      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {data.products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                currencyCode={currencyCode}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
