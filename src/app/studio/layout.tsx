/**
 * Sanity Studio must not be wrapped in the public site Navbar/Footer (see app/(site)/layout.tsx).
 * This layout keeps the editor full-viewport without chrome from the marketing site.
 */
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen">{children}</div>
}
