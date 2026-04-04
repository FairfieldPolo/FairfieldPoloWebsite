import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { ShopifyStore } from '@/components/sections/ShopifyStore'

export const metadata: Metadata = {
  title: 'Club Store',
  description: 'Shop Fairfield Polo Club merchandise — apparel, accessories, and polo gear.',
}

export default function StorePage() {
  return (
    <>
      <PageHero
        title="Club Store"
        subtitle="Official Fairfield Polo Club merchandise. Wear your colors."
        eyebrow="Shop"
      />
      <ShopifyStore />
    </>
  )
}
