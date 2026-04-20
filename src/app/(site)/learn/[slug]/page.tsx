import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import { sanityFetch, urlFor } from '@/lib/sanity'
import { ARTICLE_BY_SLUG_QUERY } from '@/lib/queries'
import type { EducationArticle } from '@/types'

export const revalidate = 3600

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await sanityFetch<EducationArticle | null>(ARTICLE_BY_SLUG_QUERY, { slug })
  if (!article) return { title: 'Article not found' }
  return {
    title: article.title,
    description: article.excerpt,
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await sanityFetch<EducationArticle | null>(ARTICLE_BY_SLUG_QUERY, { slug })
  if (!article) notFound()

  return (
    <div className="pt-24 bg-polo-cream min-h-screen">
      <div className="container-polo py-10 max-w-3xl">
        <Link href="/learn" className="font-body text-sm text-polo-green/60 hover:text-polo-green mb-6 inline-block">
          ← Back to Learn Polo
        </Link>

        {article.image && (
          <div className="relative h-56 rounded-sm overflow-hidden mb-8">
            <Image
              src={urlFor(article.image).width(900).height(400).url()}
              alt={article.image.alt ?? article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="gold-rule mb-5" />
        <h1 className="heading-display text-polo-green mb-4">{article.title}</h1>
        {article.excerpt && (
          <p className="font-body text-lg text-gray-500 leading-relaxed mb-8 border-l-2 border-polo-gold pl-4">
            {article.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none font-body
                        prose-headings:font-display prose-headings:text-polo-green
                        prose-a:text-polo-green prose-a:no-underline hover:prose-a:underline
                        prose-strong:text-polo-charcoal
                        prose-li:text-gray-600 prose-p:text-gray-600">
          <PortableText value={article.body} />
        </div>

        <div className="mt-12 pt-6 border-t border-polo-cream-dark">
          <Link href="/learn" className="font-body text-sm text-polo-green/60 hover:text-polo-green">
            ← All polo education
          </Link>
        </div>
      </div>
    </div>
  )
}
