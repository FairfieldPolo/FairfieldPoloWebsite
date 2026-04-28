export type SiteNavLink = {
  label: string
  href: string
  external?: boolean
}

export type SiteNavSection = {
  label: string
  href: string
  links: SiteNavLink[]
}

/*
 * Site architecture guardrail:
 * The top-level public navigation is intentionally hard-coded in code, not Sanity.
 * Sanity owns editable page content, posts, events, images, and copy; it should not
 * grow or reorder the primary IA without an intentional code change.
 */
export const PUBLIC_HEADER_NAV: SiteNavLink[] = [
  { label: 'Schedule', href: '/schedule' },
  { label: 'Club', href: '/club' },
  { label: 'Venue', href: '/venue' },
  { label: 'Learn', href: '/learn' },
  { label: 'Shop', href: '/shop' },
  { label: 'Contact', href: '/contact' },
]

/*
 * Secondary IA is also structured in code. Individual page content can come from
 * Sanity, but these buckets keep marketing, venue, learning, shop, and contact
 * intent separated.
 */
export function getFooterNavigation(instagramHandle: string): SiteNavSection[] {
  return [
    {
      label: 'Schedule',
      href: '/schedule',
      links: [
        { label: 'Matches', href: '/matches/live' },
        { label: 'Calendar', href: '/schedule/calendar' },
        { label: 'Results', href: '/schedule/results' },
        { label: 'Upcoming Events', href: '/schedule' },
      ],
    },
    {
      label: 'Club',
      href: '/club',
      links: [
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
    },
    {
      label: 'Venue',
      href: '/venue',
      links: [
        { label: 'Weddings', href: '/venue/weddings' },
        { label: 'Corporate Events', href: '/venue/corporate' },
        { label: 'Private Parties', href: '/venue/private-events' },
        { label: 'Pavilion Rental', href: '/venue/pavilion' },
        { label: 'Grounds Rental', href: '/venue/grounds' },
        { label: 'Photo Shoots', href: '/venue/photo-shoots' },
        { label: 'Request Pricing', href: '/venue/pricing' },
        { label: 'Gallery', href: '/venue/gallery' },
      ],
    },
    {
      label: 'Learn',
      href: '/learn',
      links: [
        { label: 'How to Watch Polo', href: '/learn/watch' },
        { label: 'What Is Polo', href: '/learn/what-is-polo' },
        { label: 'Beginner Info', href: '/learn/beginner' },
        { label: 'Lessons', href: '/learn/lessons' },
        { label: 'Getting Started', href: '/learn/getting-started' },
      ],
    },
    {
      label: 'Shop',
      href: '/shop',
      links: [
        { label: 'Apparel', href: '/shop/apparel' },
        { label: 'Hats', href: '/shop/hats' },
        { label: 'Gifts', href: '/shop/gifts' },
      ],
    },
    {
      label: 'Contact',
      href: '/contact',
      links: [
        { label: 'Inquiry', href: '/contact' },
        { label: 'Sponsorships', href: '/contact#sponsorships' },
        { label: 'Social Media', href: '/contact#social' },
        { label: 'Book a Tour', href: '/contact#tour' },
        { label: 'Instagram', href: `https://instagram.com/${instagramHandle}`, external: true },
      ],
    },
  ]
}
