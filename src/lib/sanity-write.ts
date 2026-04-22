import { createClient, type SanityClient } from '@sanity/client'

let _write: SanityClient | null = null

/** Server-only Sanity client with write token. Never import in client components. */
export function getSanityWriteClient(): SanityClient {
  if (typeof window !== 'undefined') {
    throw new Error('getSanityWriteClient is server-only')
  }
  const token = process.env.SANITY_API_WRITE_TOKEN
  if (!token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN')
  }
  if (!_write) {
    _write = createClient({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-01-01',
      useCdn: false,
      token,
    })
  }
  return _write
}
