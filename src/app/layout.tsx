import type { Metadata } from 'next'
import '@/styles/globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Toaster } from 'react-hot-toast'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fairfieldpolo.com'),
  title: {
    default:  'Fairfield Polo Club — Haysville, Kansas',
    template: '%s | Fairfield Polo Club',
  },
  description:
    'One of the oldest USPA polo clubs in America, founded 1931. ' +
    'Watch live polo every Sunday at 1pm in Haysville, Kansas. ' +
    'Open to the public — bring the family.',
  keywords: [
    'polo', 'polo club', 'Wichita', 'Haysville', 'Kansas', 'USPA',
    'Fairfield Polo', 'live polo', 'polo match', 'polo Kansas',
  ],
  openGraph: {
    type:        'website',
    locale:      'en_US',
    siteName:    'Fairfield Polo Club',
    title:       'Fairfield Polo Club — Haysville, Kansas',
    description: 'Live polo every Sunday. Founded 1931. Open to the public.',
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
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
