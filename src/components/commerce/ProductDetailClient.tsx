'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { HttpTypes } from '@medusajs/types'

import { resolveMedusaAssetUrl } from '@/lib/commerce/assets'
import { formatCartMoney } from '@/lib/commerce/medusa-money'

import { AddToCartButton } from './AddToCartButton'

type Props = {
  product: HttpTypes.StoreProduct
  currencyCode: string
}

export function ProductDetailClient({ product, currencyCode }: Props) {
  const variants = product.variants ?? []
  const [variantId, setVariantId] = useState(variants[0]?.id ?? '')

  const selected = useMemo(
    () => variants.find((v) => v.id === variantId) ?? variants[0],
    [variants, variantId]
  )

  const img =
    resolveMedusaAssetUrl(product.thumbnail ?? product.images?.[0]?.url) ??
    null

  const priceAmount = selected?.calculated_price?.calculated_amount ?? null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
      <div className="relative aspect-square bg-polo-cream-dark rounded-sm overflow-hidden">
        {img ? (
          <Image
            src={img}
            alt={product.title ?? 'Product'}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center font-display text-polo-green/25 text-xl">
            No image
          </div>
        )}
      </div>
      <div>
        <h1 className="font-display text-3xl md:text-4xl text-polo-green mb-4">
          {product.title}
        </h1>
        {product.description ? (
          <p className="font-body text-gray-700 whitespace-pre-wrap mb-6 leading-relaxed">
            {product.description}
          </p>
        ) : null}

        {variants.length > 1 ? (
          <label className="block mb-4">
            <span className="font-body text-sm text-gray-600 block mb-2">Options</span>
            <select
              className="input-polo w-full"
              value={variantId}
              onChange={(e) => setVariantId(e.target.value)}
            >
              {variants.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.title ?? v.sku ?? v.id}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        {priceAmount != null ? (
          <p className="font-display text-2xl text-polo-charcoal mb-8">
            {formatCartMoney(priceAmount, currencyCode)}
          </p>
        ) : null}

        <AddToCartButton
          variantId={selected?.id ?? ''}
          disabled={!selected?.id}
          className="btn-primary w-full sm:w-auto justify-center px-10"
        />
      </div>
    </div>
  )
}
