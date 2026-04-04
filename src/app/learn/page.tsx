import type { Metadata } from 'next'
import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { EDUCATION_ARTICLES_QUERY } from '@/lib/queries'
import type { EducationArticle, ArticleCategory } from '@/types'
import { PageHero } from '@/components/ui/PageHero'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Learn Polo',
  description: 'Learn the rules of polo, equipment guide, polo glossary, and how to watch a match. Your complete introduction to the sport.',
}

const CATEGORY_META: Record<ArticleCategory, { label: string; icon: string; desc: string }> = {
  rules:      { label: 'Rules of the game', icon: '⊞', desc: 'How the game is played, scored, and officiated' },
  equipment:  { label: 'Equipment guide',   icon: '⊡', desc: 'Mallets, balls, saddles, and what players wear' },
  history:    { label: 'History of polo',   icon: '◈', desc: 'From ancient origins to the modern sport' },
  glossary:   { label: 'Polo glossary',     icon: '≡',  desc: "Every term you'll hear at a match, explained" },
  howtowatch: { label: 'How to watch',      icon: '◎', desc: 'Tips for getting the most out of your first match' },
}

export default async function LearnPage() {
  const articles = await sanityFetch<EducationArticle[]>(EDUCATION_ARTICLES_QUERY)

  const byCategory = Object.keys(CATEGORY_META).reduce<Record<string, EducationArticle[]>>((acc, cat) => {
    acc[cat] = articles.filter(a => a.category === cat)
    return acc
  }, {})

  return (
    <>
      <PageHero
        title="Learn Polo"
        subtitle="Everything you need to understand and enjoy the sport — from your first chukker to your hundredth."
        eyebrow="Education"
      />

      <section className="section-cream section-pad">
        <div className="container-polo">

          {/* Quick-start cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
            {(Object.entries(CATEGORY_META) as [ArticleCategory, typeof CATEGORY_META[ArticleCategory]][]).map(([cat, meta]) => {
              const catArticles = byCategory[cat] ?? []
              return (
                <div key={cat} className="card p-6 flex flex-col hover:shadow-md transition-shadow">
                  <div className="font-display text-2xl text-polo-gold mb-3">{meta.icon}</div>
                  <h2 className="heading-card text-polo-green mb-2">{meta.label}</h2>
                  <p className="font-body text-sm text-gray-500 mb-4 flex-1">{meta.desc}</p>
                  {catArticles.length > 0 ? (
                    <ul className="space-y-1 mb-4">
                      {catArticles.slice(0, 3).map(a => (
                        <li key={a._id}>
                          <Link
                            href={`/learn/${a.slug.current}`}
                            className="font-body text-sm text-polo-green hover:text-polo-green-light transition-colors"
                          >
                            → {a.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="font-body text-xs text-gray-400 italic mb-4">Coming soon</p>
                  )}
                </div>
              )
            })}
          </div>

          {/* Quick facts strip */}
          <div className="bg-polo-green rounded-sm p-8">
            <div className="gold-rule mb-6" />
            <h2 className="font-display text-2xl text-polo-cream font-bold mb-6">Polo at a glance</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { stat: '6',         label: 'Chukkers per match',     note: '7 minutes each' },
                { stat: '4',         label: 'Players per team',        note: 'Positions 1–4' },
                { stat: '300 yards', label: 'Field length',            note: 'Widest in sport' },
                { stat: '3½ oz',     label: 'Ball weight',             note: 'White willow root' },
              ].map(({ stat, label, note }) => (
                <div key={label} className="border-l-2 border-polo-gold pl-4">
                  <div className="font-display text-2xl font-bold text-polo-gold">{stat}</div>
                  <div className="font-body text-sm text-polo-cream font-medium mt-1">{label}</div>
                  <div className="font-body text-xs text-polo-cream/50 mt-0.5">{note}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
