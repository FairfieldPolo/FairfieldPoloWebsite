# Fairfield Polo Club — Website

Official website for Fairfield Polo Club, Haysville, Kansas. Est. 1931.

Built with Next.js 15, Sanity CMS, Medusa (headless commerce), Tailwind CSS, deployed on Vercel.

---

## Stack

| Layer       | Technology                              |
|-------------|------------------------------------------|
| Frontend    | Next.js 15 (App Router, TypeScript)      |
| Styling     | Tailwind CSS                             |
| CMS         | Sanity v5 (embedded Studio)            |
| Commerce    | Medusa v2 (separate backend) + `@medusajs/js-sdk` |
| Email       | Resend (contact form)                    |
| Newsletter  | Mailchimp API                            |
| Instagram   | Behold.so embed                          |
| Deployment  | Vercel                                   |

**Data boundaries:** Editorial content (events, articles, sponsors, settings) lives in **Sanity**. Products, inventory, carts, and orders live in **Medusa**. The Next.js app calls Medusa’s **Store API** via server routes and the JS SDK.

---

## Commerce (Medusa)

The **store** (`/store`, product pages, cart, checkout) requires a running **Medusa** server. This repo is only the storefront; it does not embed Medusa’s server code.

### 1. Create and run Medusa locally

Follow the official guide: [Install Medusa](https://docs.medusajs.com/learn/installation). Typical dev URL: `http://localhost:9000`.

### 2. Publishable API key

In **Medusa Admin** → **Settings** → **Publishable API keys**, create a key and add to `.env.local`:

- `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
- `MEDUSA_BACKEND_URL` — e.g. `http://localhost:9000`
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` — same value (used for product image URLs in the browser)

### 3. CORS

Allow your Next.js origin in Medusa (`http://localhost:3000` and production URL). See Medusa docs for `STORE_CORS` / admin config.

### 4. Region (optional)

Set `MEDUSA_DEFAULT_REGION_ID` to a region id from Medusa Admin → **Settings** → **Regions** if you do not want auto-detection.

### 5. Payments (Stripe / PayPal)

Configure payment modules in **Medusa** (not in this repo). Card data never touches this Next.js app; checkout flows go through Medusa’s payment session + provider (e.g. Stripe). You can embed **Stripe Payment Element** on the checkout step using the client secret from the payment session returned by `POST /api/commerce/checkout/init`.

### 6. Service / convenience fee

Optional env vars (see `.env.example`) control a **transparent fee row** in the cart summary. **Legal/compliance** for convenience fees on card payments is your responsibility; comments in `src/lib/commerce/service-fee.ts` and `CartTotals.tsx` describe behavior. For a fee to be charged in Medusa, you typically add a **fee product/variant** or a **custom Medusa module**—do not rely on UI-only rows for collection.

### 7. Product images (Next/Image)

`next.config.ts` allows `http://localhost:9000` for local Medusa files. For production, add your file CDN hostname to `images.remotePatterns`.

---

## Getting started

### 1. Clone and install

```bash
git clone <your-repo-url> fairfield-polo
cd fairfield-polo
npm install
```

### Project doctor

Before deploy, DNS, or service credential work, verify local context:

```bash
cp .env.infrastructure.example .env.infrastructure.local
# fill PROJECT_GITHUB_ACCOUNT and paths
make doctor
```

`make doctor` checks GitHub origin, Node tooling, `.env.local` service vars
(Sanity, Medusa, Resend, Mailchimp, Behold), Cloudflare DNS for
`fairfieldpolo.com`, live HTTPS, and that secrets are not tracked.

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in every value in `.env.local`. Accounts you need:

**Sanity** (free)

- sanity.io → New project
- Copy Project ID → `NEXT_PUBLIC_SANITY_PROJECT_ID`
- API token (read) → `SANITY_API_READ_TOKEN`

**Medusa** (self-hosted or Medusa Cloud)

- Run Medusa, create publishable key → see Commerce section above

**Mailchimp** (free tier)

- Audience ID, API key, server prefix (`us1`, etc.)

**Resend** (free tier)

- resend.com → API key; verify domain for production

**Behold** (Instagram)

- behold.so → widget ID → `NEXT_PUBLIC_BEHOLD_WIDGET_ID`

### 3. Run locally

```bash
npm run dev
```

- Site: http://localhost:3000  
- Studio: http://localhost:3000/studio  
- Medusa (if local): http://localhost:9000  

### 4. Sanity content

In the Studio: **Site settings**, **Events**, **Announcements**, **Sponsors**, **Education articles**.

---

## Deployment (Vercel)

Set all env vars from `.env.local` in Vercel. Point `MEDUSA_BACKEND_URL` / `NEXT_PUBLIC_MEDUSA_BACKEND_URL` at your **production** Medusa URL (HTTPS).

Post-deploy:

- `NEXT_PUBLIC_SITE_URL` = production URL  
- Sanity → API → CORS for production  
- Medusa CORS for production storefront origin  

---

## Project structure (high level)

```
src/
  app/
    store/                 — Shop listing, PDP, cart, checkout, order confirmation
    api/commerce/          — Medusa cart + checkout API (cookie-backed cart id)
  components/
    commerce/              — Product grid, cart UI, checkout form, totals
  lib/
    medusa/                — Server SDK client, region helper
    commerce/              — Money helpers, service fee config, assets
```

---

## Roadmap

| Tier | What's included             | Status   |
|------|-----------------------------|----------|
| 1    | Communication hub + store     | In progress |
| 2    | Live scoreboard + game day  | Planned  |
| 3    | Members + ticketing + …     | Planned  |

---

## Key accounts

| Service    | Action needed                    |
|------------|---------------------------------|
| Sanity     | Project + read token            |
| Medusa     | Backend + publishable key + payments |
| Mailchimp  | Audience + API key              |
| Resend     | API key / domain                |
| Behold     | Instagram widget                |
| Vercel     | Deploy + env vars               |

---

Built by [your developer] · Fairfield Polo Club
