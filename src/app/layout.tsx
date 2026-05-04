import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast'
import { sanityFetch } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types'
import {
  getPublicPoloCopy,
  openGraphDescription,
  rootLayoutDescription,
} from '@/lib/site/publicPolo'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fairfieldpolo.com'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  const polo = getPublicPoloCopy(settings)
  const description = rootLayoutDescription(polo)
  const ogDesc = openGraphDescription(polo)
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default:  'Fairfield Polo Club — Haysville, Kansas',
      template: '%s | Fairfield Polo Club',
    },
    description,
    keywords: [
      'polo', 'polo club', 'Wichita', 'Haysville', 'Kansas', 'USPA',
      'Fairfield Polo', 'live polo', 'polo match', 'polo Kansas',
    ],
    openGraph: {
      type:        'website',
      locale:      'en_US',
      siteName:    'Fairfield Polo Club',
      title:       'Fairfield Polo Club — Haysville, Kansas',
      description: ogDesc,
      images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
    },
    twitter: {
      card:  'summary_large_image',
      title: 'Fairfield Polo Club',
    },
    robots: {
      index:  true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-polo-cream font-body antialiased">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a3a2a',
              color: '#f8f4ed',
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: '14px',
            },
          }}
        />
        {children}
      </body>
    </html>
  )
}
