import type { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/ui/PageHero'
import { NewsletterSection } from '@/components/sections/NewsletterSection'

export const metadata: Metadata = {
  title: 'Polo Lessons Wichita',
  description:
    'Interested in polo lessons near Wichita, KS? Learn about beginner-friendly polo opportunities at Fairfield Polo Club in Haysville.',
  keywords: [
    'Polo lessons Wichita',
    'Polo lessons Wichita KS',
    'Learn polo Wichita',
    'Wichita polo club lessons',
  ],
}

export default function PoloLessonsWichitaPage() {
  return (
    <>
      <PageHero
        title="Polo Lessons in the Wichita Area"
        subtitle="Start your polo journey at Fairfield Polo Club, located just south of Wichita."
        eyebrow="Lessons"
      />

      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="card p-7">
              <div className="gold-rule mb-5" />
              <h2 className="heading-section text-polo-green mb-4">Beginner-friendly polo instruction</h2>
              <div className="space-y-4 font-body text-sm text-gray-600 leading-relaxed">
                <p>
                  If you are searching for <strong>polo lessons in Wichita</strong>, Fairfield Polo Club
                  is a great place to begin. Our community helps newcomers understand the game,
                  the horses, and the basics of safe riding and play.
                </p>
                <p>
                  We work with interested riders and aspiring players based on season timing and
                  instructor availability. The best first step is to contact us and share your
                  riding background and goals.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-polo-green rounded-sm p-6">
                <h3 className="font-display text-xl text-polo-gold font-semibold mb-3">How to get started</h3>
                <ol className="space-y-2 font-body text-sm text-polo-cream/85">
                  <li>1. Send a message through our contact form.</li>
                  <li>2. Tell us your riding experience level.</li>
                  <li>3. We will follow up with next-available options.</li>
                </ol>
              </div>

              <div className="card p-6 space-y-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center font-body text-sm font-medium text-polo-green hover:text-polo-green-light transition-colors"
                >
                  Contact us about lessons →
                </Link>
                <Link
                  href="/learn"
                  className="inline-flex items-center font-body text-sm font-medium text-polo-green hover:text-polo-green-light transition-colors"
                >
                  Learn polo basics first →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  )
}
