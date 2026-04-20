import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { ProductDetailClient } from '@/components/commerce/ProductDetailClient'
import { StoreNotConfigured } from '@/components/commerce/StoreNotConfigured'
import { PageHero } from '@/components/ui/PageHero'
import { getProductByHandle, getStoreCurrencyCode } from '@/lib/commerce/products'
import { isMedusaConfigured } from '@/lib/medusa/server'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  if (!isMedusaConfigured()) {
    return { title: 'Product' }
  }
  const data = await getProductByHandle(handle)
  const title = data?.product?.title ?? 'Product'
  return {
    title: `${title} — Club Store`,
    description: data?.product?.description ?? undefined,
  }
}

export default async function StoreProductPage({ params }: Props) {
  const { handle } = await params

  if (!isMedusaConfigured()) {
    return (
      <>
        <PageHero title="Store" subtitle="" eyebrow="Shop" />
        <StoreNotConfigured />
      </>
    )
  }

  const data = await getProductByHandle(handle)
  if (!data?.product) {
    notFound()
  }

  const currencyCode = await getStoreCurrencyCode(data.regionId)

  return (
    <>
      <div className="bg-polo-cream border-b border-polo-cream-dark">
        <div className="container-polo py-4">
          <Link
            href="/store"
            className="font-body text-sm text-polo-green hover:underline"
          >
            ← Back to store
          </Link>
        </div>
      </div>
      <section className="section-cream section-pad">
        <div className="container-polo max-w-5xl">
          <ProductDetailClient product={data.product} currencyCode={currencyCode} />
        </div>
      </section>
    </>
  )
}
