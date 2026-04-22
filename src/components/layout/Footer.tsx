import Link from 'next/link'
import { sanityFetch } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types'
import { resolvePrimaryLocation } from '@/lib/site/location'
import { getPublicPoloCopy } from '@/lib/site/publicPolo'
import { shopUrl } from '@/lib/site/shop-url'

const INSTAGRAM_HANDLE = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE ?? 'fairfieldpoloclub'

const FOOTER_LINKS = {
  'Visit Us': [
    { label: 'Events & Schedule', href: '/events' },
    { label: 'Season Schedule',   href: '/schedule' },
    { label: 'Directions',        href: '/contact#directions' },
    { label: 'Contact Us',        href: '/contact' },
  ],
  'The Club': [
    { label: 'About',             href: '/about' },
    { label: 'Membership',        href: '/membership' },
    { label: 'USPA Membership',   href: '/about#uspa' },
    { label: 'Sponsors',          href: '/about#sponsors' },
  ],
  'Learn Polo': [
    { label: 'Rules of the Game', href: '/learn/rules' },
    { label: 'Equipment Guide',   href: '/learn/equipment' },
    { label: 'Polo Glossary',     href: '/learn/glossary' },
    { label: 'How to Watch',      href: '/learn/how-to-watch' },
  ],
  'Connect': [
    { label: 'Online Store',        href: shopUrl('/store') },
    { label: 'Mailing List',      href: '/contact#newsletter' },
    { label: 'Instagram',         href: `https://instagram.com/${INSTAGRAM_HANDLE}`, external: true },
    { label: 'YouTube',           href: 'https://youtube.com',   external: true },
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

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
