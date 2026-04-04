# Fairfield Polo Club — Website

Official website for Fairfield Polo Club, Haysville, Kansas. Est. 1931.

Built with Next.js 15, Sanity CMS, Shopify Buy Button, Tailwind CSS, deployed on Vercel.

---

## Stack

| Layer       | Technology                      |
|-------------|----------------------------------|
| Frontend    | Next.js 15 (App Router, TypeScript) |
| Styling     | Tailwind CSS                    |
| CMS         | Sanity v3 (embedded Studio)     |
| Commerce    | Shopify Buy Button / Storefront API |
| Email       | Resend (contact form)           |
| Newsletter  | Mailchimp API                   |
| Instagram   | Behold.so embed                 |
| Deployment  | Vercel                          |

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url> fairfield-polo
cd fairfield-polo
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local`. Accounts you need to create:

**Sanity** (free)
- Go to sanity.io → New project → name it "fairfield-polo"
- Copy Project ID and paste into `NEXT_PUBLIC_SANITY_PROJECT_ID`
- Create an API token (Read, no write) → paste into `SANITY_API_READ_TOKEN`

**Shopify** (paid — Basic plan ~$39/mo)
- Create store at shopify.com
- Go to Settings → Apps → Storefront API → create a token
- Go to Sales Channels → Buy Button → create a Collection button
- Copy the Collection ID and Storefront token

**Mailchimp** (free tier)
- Create account → Audience → Settings → Audience name & defaults → Audience ID
- Account → Extras → API Keys → Create A Key
- Server prefix is the `usN` in your API key (e.g. `us1`)

**Resend** (free tier — 3,000 emails/month)
- Sign up at resend.com → API Keys → Create Key
- Verify your domain or use their sandbox domain for dev

**Behold** (free tier — Instagram embed)
- Sign up at behold.so → New widget → connect Instagram
- Copy Widget ID → paste into `NEXT_PUBLIC_BEHOLD_WIDGET_ID`

### 3. Run locally

```bash
npm run dev
```

Open http://localhost:3000

Sanity Studio runs at http://localhost:3000/studio

### 4. Set up Sanity content

In the Studio:
1. Go to **Site settings** → fill in club details, upload logo
2. Create a few **Events** for the current season
3. Add **Announcements** if needed
4. Add **Sponsors** with logos
5. Create **Education articles** (rules, glossary, equipment guide)

---

## Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Project → Settings → Environment Variables
# Copy everything from .env.local
```

Or connect your GitHub repo to Vercel for automatic deployments on every push to `main`.

**Post-deploy:**
- Add your production URL to `NEXT_PUBLIC_SITE_URL`
- In Sanity Studio → API → Add your production URL to CORS origins
- In Shopify → Buy Button → add production domain

---

## Project structure

```
src/
  app/
    page.tsx              — Homepage
    layout.tsx            — Root layout (nav, footer, fonts)
    not-found.tsx         — 404 page
    sitemap.ts            — SEO sitemap (auto-generated)
    robots.ts             — robots.txt
    events/
      page.tsx            — Events index
      [slug]/page.tsx     — Event detail
    schedule/page.tsx     — Season schedule (list view)
    store/page.tsx        — Shopify store embed
    learn/
      page.tsx            — Education hub
      [slug]/page.tsx     — Article detail
    about/page.tsx        — Club history + USPA + get involved
    contact/page.tsx      — Contact form + map + directions
    studio/[[...tool]]/   — Embedded Sanity Studio
    api/
      contact/route.ts    — Contact form → Resend email
      newsletter/route.ts — Newsletter signup → Mailchimp
      ical/route.ts       — iCal download for events

  components/
    layout/
      Navbar.tsx          — Responsive nav (transparent on hero)
      Footer.tsx          — Full 4-column footer
    sections/
      HeroSection.tsx     — Full-screen homepage hero
      AnnouncementBanner.tsx
      EventsStrip.tsx     — Homepage upcoming events
      AboutStrip.tsx      — Homepage club history
      InstagramSection.tsx
      SponsorsSection.tsx
      NewsletterSection.tsx
      ContactForm.tsx
      ShopifyStore.tsx
    ui/
      EventCard.tsx       — Used everywhere events are listed
      PageHero.tsx        — Interior page hero

  lib/
    sanity.ts             — Sanity client + image builder
    queries.ts            — All GROQ queries (centralized)
    utils.ts              — Date helpers, iCal generator, cn()

  types/
    index.ts              — All TypeScript interfaces

  styles/
    globals.css           — Tailwind + brand design system

sanity/
  schemas/
    event.ts              — Event document schema
    index.ts              — All other schemas + exports
  sanity.config.ts        — Studio configuration
```

---

## Content management

All content is managed in Sanity Studio at `/studio`.

**Who can access the Studio:**
- In Tier 1: anyone with the URL (protect with Sanity's own auth)
- In Tier 3: will be gated behind the member auth system

**What gets managed in Sanity vs the codebase:**
- Sanity: events, announcements, sponsors, education articles, photos, site settings
- Code: page layouts, navigation, design — anything structural

---

## Roadmap

| Tier | What's included             | Status  |
|------|-----------------------------|---------|
| 1    | Communication hub + store   | ✅ Built |
| 2    | Live scoreboard + game day  | Planned |
| 3    | Members + ticketing + WhatsApp | Planned |
| 4    | AI commentary + YouTube Live | Planned |

---

## Key contacts / accounts to set up

| Service    | Action needed                                  |
|------------|------------------------------------------------|
| Sanity     | Create project at sanity.io                   |
| Shopify    | Create store, get Storefront token             |
| Mailchimp  | Create account, get API key + audience ID      |
| Resend     | Create account, verify domain                  |
| Behold     | Create account, connect Instagram              |
| Vercel     | Connect GitHub repo                            |
| Google     | Create Business Profile listing                |
| YouTube    | Create Fairfield Polo Club channel             |

---

Built by [your developer] · Fairfield Polo Club © 2025
