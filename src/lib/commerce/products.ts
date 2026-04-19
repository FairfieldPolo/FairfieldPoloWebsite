import 'server-only'

import type { HttpTypes } from '@medusajs/types'

import { getMedusaSdk, isMedusaConfigured } from '@/lib/medusa/server'
import { getDefaultRegionId } from '@/lib/medusa/region'

export async function getStoreCurrencyCode(regionId: string): Promise<string> {
  const sdk = getMedusaSdk()
  const { region } = await sdk.store.region.retrieve(regionId)
  return region?.currency_code?.toUpperCase() ?? 'USD'
}

const PRODUCT_FIELDS =
  'id,title,handle,description,thumbnail,*images,*variants,*variants.calculated_price,*variants.options'

export async function listStoreProducts(): Promise<{
  products: HttpTypes.StoreProduct[]
  regionId: string
} | null> {
  if (!isMedusaConfigured()) return null

  const sdk = getMedusaSdk()
  const regionId = await getDefaultRegionId(sdk)

  const { products } = await sdk.store.product.list({
    limit: 48,
    offset: 0,
    region_id: regionId,
    fields: PRODUCT_FIELDS,
  })

  return { products: products ?? [], regionId }
}

export async function getProductByHandle(
  handle: string
): Promise<{ product: HttpTypes.StoreProduct | null; regionId: string } | null> {
  if (!isMedusaConfigured()) return null

  const sdk = getMedusaSdk()
  const regionId = await getDefaultRegionId(sdk)

  const { products } = await sdk.store.product.list({
    handle,
    limit: 1,
    region_id: regionId,
    fields: PRODUCT_FIELDS,
  })

  return { product: products?.[0] ?? null, regionId }
}
