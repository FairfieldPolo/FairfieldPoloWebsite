import Link from 'next/link'

export function StoreNotConfigured() {
  return (
    <section className="section-cream section-pad">
      <div className="container-polo">
        <div className="text-center py-16 md:py-20 px-6 bg-white border border-polo-cream-dark rounded-sm max-w-2xl mx-auto">
          <div className="font-display text-2xl md:text-3xl text-polo-green mb-3">
            Club store
          </div>
          <p className="font-body text-gray-600 mb-6 leading-relaxed">
            The online shop is not connected yet. Configure the Medusa backend and environment
            variables to show products here.
          </p>
          <Link href="/contact" className="btn-outline inline-flex">
            Contact the club
          </Link>
        </div>
      </div>
    </section>
  )
}
