import Image from 'next/image'
import Link from 'next/link'
import type { HttpTypes } from '@medusajs/types'

import { resolveMedusaAssetUrl } from '@/lib/commerce/assets'
import { formatCartMoney } from '@/lib/commerce/medusa-money'

type Props = {
  product: HttpTypes.StoreProduct
  currencyCode: string
}

export function ProductCard({ product, currencyCode }: Props) {
  const img =
    resolveMedusaAssetUrl(product.thumbnail ?? product.images?.[0]?.url) ??
    null
  const variant = product.variants?.[0]
  const priceAmount = variant?.calculated_price?.calculated_amount ?? null

  return (
    <article className="card flex flex-col overflow-hidden h-full">
      <Link href={`/store/products/${product.handle}`} className="relative aspect-square bg-polo-cream-dark block">
        {img ? (
          <Image
            src={img}
            alt={product.title ?? 'Product'}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-polo-green/25">
            No image
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-display text-xl text-polo-green leading-snug mb-2">
          <Link
            href={`/store/products/${product.handle}`}
            className="hover:text-polo-green-mid transition-colors"
          >
            {product.title}
          </Link>
        </h2>
        {priceAmount != null ? (
          <p className="font-body font-semibold text-polo-charcoal mb-4">
            {formatCartMoney(priceAmount, currencyCode)}
          </p>
        ) : (
          <p className="font-body text-gray-500 text-sm mb-4">See options</p>
        )}
        <div className="mt-auto">
          <Link
            href={`/store/products/${product.handle}`}
            className="btn-primary w-full justify-center text-sm"
          >
            View product
          </Link>
        </div>
      </div>
    </article>
  )
}
