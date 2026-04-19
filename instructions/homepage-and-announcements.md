# Homepage, announcements, and featured events

## Announcement banner (top of site)

Urgent or general messages use the **Announcement** document type in Sanity.

1. Open **Announcement** → create new or edit existing.
2. **Headline** — short text shown in the banner.
3. **Body text** — optional extra detail (rich text).
4. **Publish at** — when the banner should start showing (defaults to “now” when you create it).
5. **Expires at** — leave empty for “until I remove it,” or set a date/time to hide it automatically.
6. **Pin to top of site?** — if several announcements are active, the pinned one is preferred for the main banner.
7. **Type** — general, weather/delay, schedule change, or urgent (helps you organize in Studio; styling may vary).

Only announcements that are **published** (within the publish/expiry window) appear. After saving, allow up to about a minute for the live site to update.

## Homepage event strip

The row of event cards on the home page comes from **Events** with:

- **Feature on homepage?** = yes  
- **Start date & time** still in the future  

Up to four are shown, soonest first. See [schedule-and-events.md](./schedule-and-events.md) for editing events.

## Hero and static homepage text

The large hero section at the top of the home page is mostly **fixed in code** (headline, background treatment). Changing that wording or layout requires a developer edit to the React components, not Sanity.
