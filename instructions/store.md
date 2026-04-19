# Online store, cart, and checkout

The **Store** (`/store`), **Cart** (`/store/cart`), and **Checkout** (`/store/checkout`) connect to **Medusa**, a separate e-commerce backend. This Next.js site is only the storefront.

## What you manage in Medusa Admin

Typical tasks for club staff:

- **Products** — titles, descriptions, images, variants (sizes), prices  
- **Inventory** — stock levels  
- **Orders** — what was sold, payment status, fulfillment  
- **Regions & shipping** — where you ship and tax/shipping rules  
- **Publishable API keys** — required for the website to talk to Medusa (developers place these in environment variables)

Medusa runs on its own URL (for example `https://your-medusa-server.com`). You log into **Medusa Admin** there, not into `/studio`.

## What you do not edit in Sanity for the store

Product catalog, cart, and checkout **do not** come from Sanity documents. Sanity is for editorial content (events, articles, sponsors, etc.).

## If the store is empty or errors

- Confirm Medusa is running and reachable from the internet (production).
- Confirm `MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_BACKEND_URL`, and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` match the live Medusa project.
- Confirm **CORS** on the Medusa server allows your website’s domain.

Detailed setup is in the main project **README** under Commerce (Medusa).
