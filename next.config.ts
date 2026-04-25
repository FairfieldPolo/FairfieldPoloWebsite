import path from 'path'

import type { NextConfig } from 'next'

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
    const out: { source: string; destination: string; permanent: true }[] = [
      { source: '/events', destination: '/schedule/calendar', permanent: true },
      { source: '/about', destination: '/club/history', permanent: true },
      { source: '/membership', destination: '/club/membership', permanent: true },
      { source: '/members', destination: '/club/members', permanent: true },
      { source: '/learn/how-to-watch', destination: '/learn/watch', permanent: true },
      { source: '/polo-lessons-wichita', destination: '/learn/lessons', permanent: true },
      { source: '/wichita-event-venue', destination: '/venue/contact', permanent: true },
      { source: '/wichita-events-polo', destination: '/venue/private-events', permanent: true },
    ]
    const shop = process.env.NEXT_PUBLIC_SHOP_URL?.trim().replace(/\/$/, '')
    if (shop) {
      out.push(
        { source: '/store', destination: '/shop', permanent: true },
        { source: '/store/:path*', destination: '/shop/:path*', permanent: true },
        { source: '/shop', destination: `${shop}/store`, permanent: true },
        { source: '/shop/:path*', destination: `${shop}/store/:path*`, permanent: true }
      )
    }
    return out
  },
}

export default nextConfig
