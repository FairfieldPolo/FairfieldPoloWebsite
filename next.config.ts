import path from 'path'

import type { NextConfig } from 'next'
import { getExternalMembersAppBaseForRedirects } from './src/lib/site/members-url'

const nextConfig: NextConfig = {
  // Embedded Studio (sanity.config → sanity / @sanity/vision) must resolve the
  // default `react` entry so `useEffectEvent` is available (not react.react-server).
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        react: path.join(process.cwd(), 'node_modules/react'),
        'react-dom': path.join(process.cwd(), 'node_modules/react-dom'),
      }
    }
    return config
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.sanity.io' },
      { protocol: 'https', hostname: 'img1.wsimg.com' },
      // Medusa default file backend (local dev). Add your production file host when deploying Medusa.
      { protocol: 'http', hostname: 'localhost', port: '9000', pathname: '/**' },
    ],
  },
  async redirects() {
    const out: { source: string; destination: string; permanent: true }[] = []
    const shop = process.env.NEXT_PUBLIC_SHOP_URL?.trim().replace(/\/$/, '')
    if (shop) {
      out.push(
        { source: '/store', destination: `${shop}/store`, permanent: true },
        { source: '/store/:path*', destination: `${shop}/store/:path*`, permanent: true }
      )
    }
    // Same base as `membersUrl()` (full app URL, not necessarily host root). Optionally includes a path.
    const membersApp = getExternalMembersAppBaseForRedirects()
    if (membersApp) {
      out.push(
        { source: '/members', destination: membersApp, permanent: true },
        { source: '/members/:path*', destination: `${membersApp}/:path*`, permanent: true }
      )
    }
    return out
  },
}

export default nextConfig
