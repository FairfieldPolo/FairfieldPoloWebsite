import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-polo-green flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-display text-[10rem] font-bold text-polo-green-mid leading-none select-none">
          404
        </div>
        <div className="gold-rule mx-auto mb-6" />
        <h1 className="font-display text-3xl text-polo-cream font-bold mb-3">
          Out of bounds
        </h1>
        <p className="font-body text-polo-cream/60 mb-8 max-w-sm mx-auto">
          That page doesn't exist — much like a polo ball that's sailed wide of the goal.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-gold">
            Back to home
          </Link>
          <Link href="/schedule" className="btn-outline border-polo-cream/30 text-polo-cream hover:bg-polo-cream hover:text-polo-green">
            See upcoming events
          </Link>
        </div>
      </div>
    </div>
  )
}
