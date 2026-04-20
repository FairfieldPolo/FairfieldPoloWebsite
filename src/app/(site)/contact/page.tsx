import type { Metadata } from 'next'
import { PageHero } from '@/components/ui/PageHero'
import { ContactForm } from '@/components/sections/ContactForm'
import { NewsletterSection } from '@/components/sections/NewsletterSection'
import { sanityFetch } from '@/lib/sanity'
import { SITE_SETTINGS_QUERY } from '@/lib/queries'
import type { SiteSettings } from '@/types'
import {
  googleMapsEmbedSrc,
  openInGoogleMapsHref,
  resolvePrimaryLocation,
} from '@/lib/site/location'

export const metadata: Metadata = {
  title: 'Contact & Directions',
  description: 'Get in touch with Fairfield Polo Club or get directions to 9420 South Broadway Ave, Haysville, Kansas.',
}

export default async function ContactPage() {
  const settings = await sanityFetch<SiteSettings | null>(SITE_SETTINGS_QUERY)
  const primary = resolvePrimaryLocation(settings)
  const mapEmbedSrc = googleMapsEmbedSrc(primary.mapsQuery)
  const mapLinkHref = openInGoogleMapsHref(primary, settings)

  return (
    <>
      <PageHero
        title="Contact & Directions"
        subtitle="We'd love to hear from you. Find us on the plains south of Wichita."
      />

      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

            {/* Contact form */}
            <div>
              <div className="gold-rule mb-6" />
              <h2 className="heading-section text-polo-green mb-2">Send us a message</h2>
              <p className="font-body text-gray-500 mb-8">
                Questions about the club, upcoming events, memberships, or lessons —
                we'll get back to you as soon as we can.
              </p>
              <ContactForm />
            </div>

            {/* Info column */}
            <div className="space-y-8">

              {/* Map */}
              <div id="directions">
                <div className="gold-rule mb-6" />
                <h2 className="heading-section text-polo-green mb-4">Find us</h2>
                <div className="rounded-sm overflow-hidden border border-polo-cream-dark h-56 md:h-72 bg-polo-green/10">
                  <iframe
                    title="Fairfield Polo Club map"
                    src={mapEmbedSrc}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex gap-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-polo-green mt-0.5 flex-shrink-0">
                      <path d="M8 1C5.79 1 4 2.79 4 5c0 3.5 4 9 4 9s4-5.5 4-9c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.1"/>
                      <circle cx="8" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.1"/>
                    </svg>
                    <div>
                      <p className="font-body text-sm font-medium text-polo-charcoal">
                        {primary.line1}
                      </p>
                      {primary.line2 ? (
                        <p className="font-body text-sm text-gray-500">{primary.line2}</p>
                      ) : null}
                    </div>
                  </div>
                  <a
                    href={mapLinkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 font-body text-sm text-polo-green hover:text-polo-green-light transition-colors mt-1"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              {/* Direct contact */}
              <div className="card p-5 space-y-4">
                <h3 className="font-body text-xs uppercase tracking-widest text-gray-400">Direct contact</h3>
                <a
                  href="mailto:wichitapoloclub@gmail.com"
                  className="flex items-center gap-3 font-body text-sm text-polo-green hover:text-polo-green-light transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
                    <rect x="1" y="3" width="14" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.1"/>
                    <path d="M1 4l7 5 7-5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
                  </svg>
                  wichitapoloclub@gmail.com
                </a>
              </div>

              {/* Game day info */}
              <div className="bg-polo-green rounded-sm p-5">
                <h3 className="font-display text-polo-gold font-semibold mb-2">Game day</h3>
                <ul className="space-y-2 font-body text-sm text-polo-cream/80">
                  <li className="flex gap-2"><span className="text-polo-gold">·</span> Sundays at 1:00 PM</li>
                  <li className="flex gap-2"><span className="text-polo-gold">·</span> Gates open at noon</li>
                  <li className="flex gap-2"><span className="text-polo-gold">·</span> Free admission</li>
                  <li className="flex gap-2"><span className="text-polo-gold">·</span> Bring lawn chairs or blankets</li>
                  <li className="flex gap-2"><span className="text-polo-gold">·</span> Dogs welcome on leash</li>
                  <li className="flex gap-2"><span className="text-polo-gold">·</span> No advance tickets required</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <NewsletterSection />
    </>
  )
}
