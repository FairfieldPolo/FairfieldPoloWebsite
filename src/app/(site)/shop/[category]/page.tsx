import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHero } from '@/components/ui/PageHero'

const CATEGORIES: Record<string, string> = {
  apparel: 'Apparel',
  hats:    'Hats',
  gifts:   'Gifts',
}

export function generateStaticParams() {
  return Object.keys(CATEGORIES).map((category) => ({ category }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ category: string }> }
): Promise<Metadata> {
  const { category } = await params
  const label = CATEGORIES[category]
  if (!label) return {}
  return {
    title: `${label} Shop`,
    description: `Fairfield Polo Club ${label.toLowerCase()} shop placeholder.`,
  }
}

export default async function ShopCategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params
  const label = CATEGORIES[category]
  if (!label) notFound()

  return (
    <>
      <PageHero
        title={label}
        subtitle="This shop category is reserved for the future external Fairfield store."
        eyebrow="Shop"
      />
      <section className="section-cream section-pad">
        <div className="container-polo max-w-2xl">
          <div className="card p-7 text-center">
            <div className="gold-rule mb-5 mx-auto" />
            <p className="font-body text-sm text-gray-600 leading-relaxed">
              {label} will be managed through the dedicated shop experience when it is ready.
            </p>
            <Link href="/shop" className="btn-outline mt-6 inline-flex">
              Back to shop
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
