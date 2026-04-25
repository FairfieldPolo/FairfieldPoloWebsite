import { redirect } from 'next/navigation'

const CATEGORIES = new Set(['apparel', 'hats', 'gifts'])

export function generateStaticParams() {
  return Array.from(CATEGORIES).map((category) => ({ category }))
}

export default async function ShopCategoryPage(
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params
  redirect(CATEGORIES.has(category) ? `/store?category=${category}` : '/store')
}
