import 'server-only'

import Medusa from '@medusajs/js-sdk'

/**
 * Server-only Medusa Store API client.
 * Requires a running Medusa backend (see README) and publishable API key.
 */
export function getMedusaSdk() {
  const baseUrl = process.env.MEDUSA_BACKEND_URL?.replace(/\/$/, '')
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY?.trim()

  if (!baseUrl || !publishableKey) {
    throw new Error(
      'Medusa is not configured. Set MEDUSA_BACKEND_URL and NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY.'
    )
  }

  return new Medusa({
    baseUrl,
    publishableKey,
  })
}

export function isMedusaConfigured(): boolean {
  return Boolean(
    process.env.MEDUSA_BACKEND_URL?.trim() &&
      process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY?.trim()
  )
}
