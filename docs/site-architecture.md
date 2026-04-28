# Fairfield Polo Site Architecture

## Subdomain Strategy

- `www.fairfieldpolo.com` is the main public marketing site. It owns public pages, SEO landing pages, event promotion, club information, venue inquiries, and beginner education.
- `shop.fairfieldpolo.com` is reserved for the future external store, likely Shopify. The main site should only link to it or show a placeholder.
- `members.fairfieldpolo.com` is reserved for a future member portal. The current main site should treat member access as a placeholder and should not become a membership payment system.
- `match.fairfieldpolo.com` is the live scoreboard and match-tool concept. Match tooling should stay separated from normal marketing navigation.

## Sanity Boundary

Sanity manages editable content:

- page copy
- posts and articles
- events
- images and galleries
- reusable public copy

Sanity should not control the top-level site architecture. The main navigation is intentionally hard-coded in `src/lib/site/navigation.ts` so content edits cannot accidentally expand scope, reorder the public IA, or mix marketing, commerce, membership, and match-tool responsibilities.

## Public Navigation

The main public header is fixed as:

`Schedule | Club | Venue | Learn | Shop | Contact`

Secondary navigation can be structured in code and surfaced in places like the footer. Page content under those sections can still come from Sanity.

## Scope Guardrails

- Do not build full commerce on the marketing site unless explicitly requested. Use the shop placeholder or external shop subdomain.
- Do not build full membership payments or account management on the marketing site. Use placeholder/member-portal links until the members app exists.
- Do not expand live scoreboard features as part of public marketing IA. Keep match tooling as a separate app/subdomain concern.
- Prefer code-owned IA plus Sanity-owned content. This keeps Fairfield Polo refined, understandable, and less prone to content sprawl.
