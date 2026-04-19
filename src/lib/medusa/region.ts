import 'server-only'

import Medusa from '@medusajs/js-sdk'

/**
 * Region used for catalog pricing and new carts.
 * Prefer MEDUSA_DEFAULT_REGION_ID when set (from Medusa Admin → Settings → Regions).
 */
export async function getDefaultRegionId(sdk: InstanceType<typeof Medusa>): Promise<string> {
  const fromEnv = process.env.MEDUSA_DEFAULT_REGION_ID?.trim()
  if (fromEnv) return fromEnv

  const { regions } = await sdk.store.region.list({ limit: 50 })
  const us = regions.find((r) =>
    r.countries?.some((c) => c.iso_2?.toLowerCase() === 'us')
  )
  const pick = us ?? regions[0]
  if (!pick?.id) {
    throw new Error(
      'No Medusa region found. Create a region in Medusa Admin or set MEDUSA_DEFAULT_REGION_ID.'
    )
  }
  return pick.id
}
