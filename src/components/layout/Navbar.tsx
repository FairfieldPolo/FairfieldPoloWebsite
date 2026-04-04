'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_LINKS = [
  { label: 'Events',   href: '/events' },
  { label: 'Schedule', href: '/schedule' },
  { label: 'Store',    href: '/store' },
  { label: 'Learn',    href: '/learn' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
]

export function Navbar() {
  const [open, setOpen]         = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  const transparent = isHome && !scrolled && !open

  return (
    <header
      className={`
        fixed top-0 inset-x-0 z-50 transition-all duration-300
        ${transparent
          ? 'bg-transparent'
          : 'bg-polo-green shadow-lg border-b border-polo-green-mid'
        }
      `}
    >
      <div className="container-polo">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo / wordmark */}
          <Link href="/" className="flex items-center gap-3 group">
            {/* Polo mallet icon — inline SVG */}
            <svg
              width="32" height="32" viewBox="0 0 32 32"
              fill="none" xmlns="http://www.w3.org/2000/svg"
              className="flex-shrink-0"
              aria-hidden="true"
            >
              <circle cx="16" cy="16" r="15" fill="#c9a84c" opacity="0.15"/>
              <circle cx="16" cy="16" r="15" stroke="#c9a84c" strokeWidth="1"/>
              {/* Mallet head */}
              <rect x="8" y="20" width="10" height="4" rx="1" fill="#c9a84c"/>
              {/* Mallet shaft */}
              <line x1="13" y1="20" x2="22" y2="8" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <div className="flex flex-col leading-none">
              <span className={`
                font-display font-bold text-base md:text-lg tracking-wide
                transition-colors duration-300
                ${transparent ? 'text-polo-cream' : 'text-polo-cream'}
                group-hover:text-polo-gold
              `}>
                Fairfield Polo Club
              </span>
              <span className={`
                font-body text-xs tracking-widest uppercase
                transition-colors duration-300
                ${transparent ? 'text-polo-gold-light' : 'text-polo-gold'}
              `}>
                Est. 1931 · Haysville, KS
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    relative px-4 py-2 font-body text-sm font-medium
                    transition-colors duration-200
                    ${active
                      ? 'text-polo-gold'
                      : transparent
                        ? 'text-polo-cream/90 hover:text-polo-gold'
                        : 'text-polo-cream/80 hover:text-polo-gold'
                    }
                  `}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-polo-gold rounded-full" />
                  )}
                </Link>
              )
            })}
            <Link
              href="/events"
              className="ml-4 btn-gold text-sm py-2 px-5"
            >
              Watch Live
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-polo-cream"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {open ? (
                <>
                  <line x1="3" y1="3" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="19" y1="3" x2="3" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </>
              ) : (
                <>
                  <line x1="3" y1="6"  x2="19" y2="6"  stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-polo-green border-t border-polo-green-mid pb-4">
          <nav className="container-polo flex flex-col pt-2" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    py-3 px-2 font-body text-base border-b border-polo-green-mid/50
                    transition-colors
                    ${active ? 'text-polo-gold font-medium' : 'text-polo-cream/90'}
                  `}
                >
                  {link.label}
                </Link>
              )
            })}
            <Link href="/events" className="btn-gold mt-4 w-full text-center">
              Watch Live
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
