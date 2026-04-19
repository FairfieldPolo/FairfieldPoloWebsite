import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHero } from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Order confirmation',
  robots: { index: false, follow: false },
}

type Props = {
  searchParams: Promise<{ order?: string }>
}

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { order } = await searchParams

  return (
    <>
      <PageHero
        title="Thank you"
        subtitle={
          order
            ? `Your order reference: ${order}`
            : 'Your order has been received.'
        }
        eyebrow="Shop"
      />
      <section className="section-cream section-pad">
        <div className="container-polo text-center max-w-lg mx-auto font-body text-gray-700">
          <p className="mb-6">
            You will receive a confirmation email when processing is complete. Contact the club
            if you have questions about your purchase.
          </p>
          <Link href="/store" className="btn-outline inline-flex">
            Back to store
          </Link>
        </div>
      </section>
    </>
  )
}
