'use client'

import { createClient, type SanityClient } from '@sanity/client'

export function createSanityBrowserClient(): SanityClient {
  return createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
    useCdn: false,
  })
}
