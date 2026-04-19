# Website content — editor guide

These notes are for **club staff and volunteers** who update the Fairfield Polo Club site. Technical setup (servers, domains, Medusa) lives in the project **README** at the repo root.

## Where you edit content

Most **editorial** content (events, announcements, sponsors, learn articles) is managed in **Sanity Studio**, the CMS built into the site.

1. Open your live or staging site in a browser.
2. Go to **`/studio`** (for example `https://fairfieldpolo.com/studio`).
3. Sign in with the Sanity account your developer invited.

If Studio does not load, ask whoever deploys the site to confirm Sanity environment variables are set and that your email has access in the [Sanity manage console](https://www.sanity.io/manage).

## Guides by section

| Topic | File |
|--------|------|
| Schedule, event list, event detail pages, calendar download | [schedule-and-events.md](./schedule-and-events.md) |
| Homepage strip, urgent banners | [homepage-and-announcements.md](./homepage-and-announcements.md) |
| Learn / Polo 101 articles | [learn.md](./learn.md) |
| Sponsors (and static About copy) | [about-and-sponsors.md](./about-and-sponsors.md) |
| Contact form, newsletter signups | [contact-and-newsletter.md](./contact-and-newsletter.md) |
| Instagram feed on the homepage | [instagram.md](./instagram.md) |
| Online store, cart, checkout | [store.md](./store.md) |
| Site name, logo, social links in Sanity | [site-settings-sanity.md](./site-settings-sanity.md) |

## After you publish

The public site **refreshes on a short delay** (often about a minute). If you do not see changes immediately, wait briefly and hard-refresh the page (Ctrl+F5 or Cmd+Shift+R).
