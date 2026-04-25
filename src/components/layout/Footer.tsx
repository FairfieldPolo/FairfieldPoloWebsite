import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types'
import { resolvePrimaryLocation } from '@/lib/site/location'
import { getPublicPoloCopy } from '@/lib/site/publicPolo'

const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'fairfieldpoloclub'

const FOOTER_LINKS = {
  Schedule: [
    { label: 'Matches', href: '/matches/live' },
    { label: 'Calendar', href: '/schedule/calendar' },
    { label: 'Results', href: '/schedule/results' },
    { label: 'Upcoming Events', href: '/schedule' },
  ],
  Club: [
    { label: 'Membership Levels', href: '/club/membership' },
    { label: 'Join the Club', href: '/club/join' },
    { label: 'Member Portal', href: '/club/members' },
    { label: 'Visitor Info', href: '/club/visit' },
    { label: 'Directions', href: '/contact#directions' },
    { label: 'Property Map', href: '/club/map' },
    { label: 'Tailgating & Pavilion', href: '/club/tailgating' },
    { label: 'Club History', href: '/club/history' },
    { label: 'FAQs', href: '/club/faqs' },
  ],
  Venue: [
    { label: 'Weddings', href: '/venue/weddings' },
    { label: 'Corporate Events', href: '/venue/corporate' },
    { label: 'Private Parties', href: '/venue/private-events' },
    { label: 'Pavilion Rental', href: '/venue/pavilion' },
    { label: 'Grounds Rental', href: '/venue/grounds' },
    { label: 'Photo Shoots', href: '/venue/photo-shoots' },
    { label: 'Request Pricing', href: '/venue/pricing' },
    { label: 'Gallery', href: '/venue/gallery' },
  ],
  Learn: [
    { label: 'How to Watch Polo', href: '/learn/watch' },
    { label: 'What Is Polo', href: '/learn/what-is-polo' },
    { label: 'Beginner Info', href: '/learn/beginner' },
    { label: 'Lessons', href: '/learn/lessons' },
    { label: 'Getting Started', href: '/learn/getting-started' },
  ],
  Shop: [
    { label: 'Apparel', href: '/shop/apparel' },
    { label: 'Hats', href: '/shop/hats' },
    { label: 'Gifts', href: '/shop/gifts' },
  ],
  Contact: [
    { label: 'Inquiry', href: '/contact' },
    { label: 'Sponsorships', href: '/contact#sponsorships' },
    { label: 'Social Media', href: '/contact#social' },
    { label: 'Book a Tour', href: '/contact#tour' },
    { label: 'Instagram', href: `https://instagram.com/${INSTAGRAM_HANDLE}`, external: true },
  ],
}

export async function Footer() {
  const year = new Date().getFullYear()
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  const primary = resolvePrimaryLocation(settings)
  const polo = getPublicPoloCopy(settings)

  return (
    <footer className="bg-polo-charcoal text-polo-cream/80">
      {/* Main footer */}
      <div className="container-polo py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <div className="font-display text-polo-cream text-lg font-bold mb-1">
              Fairfield Polo Club
            </div>
            <div className="font-body text-xs text-polo-gold tracking-widest uppercase mb-4">
              Est. 1931 · Haysville, KS
            </div>
            <p className="font-body text-sm text-polo-cream/60 leading-relaxed mb-4">
              {polo.footerParagraph}
            </p>
            <address className="font-body text-sm text-polo-cream/60 not-italic leading-relaxed">
              {primary.line1}
              {primary.line2 ? (
                <>
                  <br />
                  {primary.line2}
                </>
              ) : null}
            </address>
            <a
              href="mailto:wichitapoloclub@gmail.com"
              className="block mt-2 text-sm text-polo-gold hover:text-polo-gold-light transition-colors"
            >
              wichitapoloclub@gmail.com
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="font-body text-xs font-semibold uppercase tracking-widest text-polo-gold mb-4">
                {heading}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    {'external' in link && link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-sm text-polo-cream/60 hover:text-polo-cream transition-colors"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="font-body text-sm text-polo-cream/60 hover:text-polo-cream transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="container-polo py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-polo-cream/40">
            © {year} Fairfield Polo Club. All rights reserved.
          </p>
          <a
            href="https://www.uspolo.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 flex-wrap justify-center sm:justify-end max-w-prose font-body text-xs
              text-polo-cream/40 hover:underline decoration-polo-gold/50 underline-offset-2 transition-colors
              focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-polo-gold/60"
          >
            <span>Member of</span>
            <span className="font-medium text-polo-gold ml-1">USPA</span>
            <span className="mx-2">·</span>
            <span>United States Polo Association</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
