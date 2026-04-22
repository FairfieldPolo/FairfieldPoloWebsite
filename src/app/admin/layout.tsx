import Link from 'next/link'

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-polo-charcoal text-polo-cream">
      <header className="border-b border-white/10 bg-polo-green">
        <div className="container-polo flex h-14 items-center justify-between">
          <Link href="/admin/matches" className="font-display text-lg text-polo-cream hover:text-polo-gold">
            Match admin
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link href="/matches/live" className="text-polo-gold-light hover:text-polo-gold">
              Public live
            </Link>
            <Link href="/" className="text-polo-cream/80 hover:text-polo-cream">
              Site home
            </Link>
          </div>
        </div>
      </header>
      <div className="container-polo py-8">{children}</div>
    </div>
  )
}
