import { defineType, defineField } from 'sanity'

export { eventSchema } from './event'
export { venueSchema } from './venue'
export { poloMatchSchema } from './poloMatch'

// ─── Sponsor ──────────────────────────────────────────────────
export const sponsorSchema = defineType({
  name:  'sponsor',
  title: 'Sponsor',
  type:  'document',
  icon:  () => '🤝',
  fields: [
    defineField({ name: 'name', title: 'Sponsor name', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'logo', title: 'Logo', type: 'image', options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'website', title: 'Website URL', type: 'url' }),
    defineField({
      name: 'tier', title: 'Sponsorship tier', type: 'string',
      options: {
        list: [
          { title: 'Title sponsor',      value: 'title' },
          { title: 'Gold sponsor',       value: 'gold' },
          { title: 'Silver sponsor',     value: 'silver' },
          { title: 'Supporting sponsor', value: 'supporting' },
        ],
        layout: 'radio',
      },
      initialValue: 'supporting',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'activeSeasons', title: 'Active seasons (e.g. 2024, 2025)',
      type: 'array', of: [{ type: 'string' }],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'tier', media: 'logo' },
    prepare({ title, subtitle, media }) {
      const tiers: Record<string, string> = { title: '★ Title', gold: '◈ Gold', silver: '◇ Silver', supporting: '· Supporting' }
      return { title, subtitle: tiers[subtitle] ?? subtitle, media }
    },
  },
})

// ─── Announcement ─────────────────────────────────────────────
export const announcementSchema = defineType({
  name:  'announcement',
  title: 'Announcement',
  type:  'document',
  icon:  () => '📢',
  fields: [
    defineField({ name: 'title', title: 'Headline', type: 'string', validation: Rule => Rule.required() }),
    defineField({ name: 'body',  title: 'Body text', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'publishedAt', title: 'Publish at', type: 'datetime', initialValue: () => new Date().toISOString() }),
    defineField({ name: 'expiresAt',  title: 'Expires at (leave blank = no expiry)', type: 'datetime' }),
    defineField({ name: 'pinned',     title: 'Pin to top of site?', type: 'boolean', initialValue: false }),
    defineField({
      name: 'type', title: 'Type', type: 'string',
      options: {
        list: [
          { title: 'General',         value: 'general' },
          { title: 'Weather / delay', value: 'weather' },
          { title: 'Schedule change', value: 'schedule' },
          { title: 'Urgent',          value: 'urgent' },
        ],
        layout: 'radio',
      },
      initialValue: 'general',
    }),
  ],
  preview: {
    select: { title: 'title', pinned: 'pinned', type: 'type' },
    prepare({ title, pinned, type }) {
      return { title: `${pinned ? '📌 ' : ''}${title}`, subtitle: type }
    },
  },
})

// ─── Education Article ─────────────────────────────────────────
export const educationArticleSchema = defineType({
  name:  'educationArticle',
  title: 'Education article',
  type:  'document',
  icon:  () => '📖',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'slug', title: 'URL slug', type: 'slug',
      options: { source: 'title', maxLength: 96 }, validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category', title: 'Category', type: 'string',
      options: {
        list: [
          { title: 'Rules of the game', value: 'rules' },
          { title: 'Equipment',         value: 'equipment' },
          { title: 'History',           value: 'history' },
          { title: 'Glossary',          value: 'glossary' },
          { title: 'How to watch',      value: 'howtowatch' },
        ],
        layout: 'radio',
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'difficulty', title: 'Level', type: 'string',
      options: {
        list: [
          { title: 'Beginner',     value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced',     value: 'advanced' },
        ],
        layout: 'radio',
      },
      initialValue: 'beginner',
    }),
    defineField({ name: 'excerpt', title: 'Excerpt / intro', type: 'text', rows: 3, validation: Rule => Rule.max(300) }),
    defineField({ name: 'body', title: 'Article body', type: 'array', of: [
      { type: 'block' },
      { type: 'image', options: { hotspot: true }, fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
        defineField({ name: 'caption', title: 'Caption', type: 'string' }),
      ]},
    ]},
    ),
    defineField({
      name: 'image', title: 'Cover image', type: 'image', options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alt text', type: 'string' })],
    }),
    defineField({ name: 'publishedAt', title: 'Published date', type: 'datetime', initialValue: () => new Date().toISOString() }),
  ],
  preview: {
    select: { title: 'title', category: 'category', media: 'image' },
    prepare({ title, category, media }) {
      const cats: Record<string, string> = { rules: 'Rules', equipment: 'Equipment', history: 'History', glossary: 'Glossary', howtowatch: 'How to watch' }
      return { title, subtitle: cats[category] ?? category, media }
    },
  },
})

// ─── Gallery ──────────────────────────────────────────────────
export const gallerySchema = defineType({
  name:  'gallery',
  title: 'Photo gallery',
  type:  'document',
  icon:  () => '🖼',
  fields: [
    defineField({ name: 'title', title: 'Gallery name', type: 'string', initialValue: 'Main gallery' }),
    defineField({
      name: 'images', title: 'Photos', type: 'array',
      of: [{
        type: 'object', name: 'galleryImage',
        fields: [
          defineField({ name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } }),
          defineField({ name: 'alt',     title: 'Alt text', type: 'string' }),
          defineField({ name: 'caption', title: 'Caption',  type: 'string' }),
          defineField({ name: 'takenAt', title: 'Date taken', type: 'date' }),
        ],
        preview: {
          select: { media: 'image', title: 'caption' },
          prepare({ media, title }) { return { media, title: title ?? 'Photo' } },
        },
      }],
      options: { layout: 'grid' },
    }),
  ],
})

// ─── Site Settings (singleton) ─────────────────────────────────
export const siteSettingsSchema = defineType({
  name:  'siteSettings',
  title: 'Site settings',
  type:  'document',
  icon:  () => '⚙️',
  fields: [
    defineField({ name: 'siteName',    title: 'Site name',    type: 'string', initialValue: 'Fairfield Polo Club' }),
    defineField({ name: 'tagline',     title: 'Tagline',      type: 'string', initialValue: 'Est. 1931 · Haysville, Kansas' }),
    defineField({ name: 'description', title: 'Meta description', type: 'text', rows: 3 }),
    defineField({ name: 'logo',        title: 'Club logo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'heroImage',   title: 'Homepage hero image', type: 'image', options: { hotspot: true } }),
    defineField({
      name:        'address',
      title:       'Address (legacy)',
      type:        'string',
      initialValue: '9420 South Broadway Avenue, Haysville, Kansas 67060',
      description: 'Used for maps/display if **Locations** is empty. Prefer adding a row under Locations (e.g. Main).',
    }),
    defineField({
      name:        'locations',
      title:       'Locations',
      type:        'array',
      description: 'First location is used for the Contact page map, embed, and footer. Add more rows for extra venues (label e.g. Main, Clubhouse).',
      of: [
        {
          type:  'object',
          name:  'clubLocation',
          title: 'Location',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. Main, Clubhouse', initialValue: 'Main' }),
            defineField({ name: 'addressLine1', title: 'Street address', type: 'string' }),
            defineField({ name: 'addressLine2', title: 'City, state, ZIP', type: 'string' }),
            defineField({
              name:        'googleMapsUrl',
              title:       'Optional: “Open in Maps” link',
              type:        'url',
              description: 'Overrides the auto-generated Google Maps search link for this location.',
            }),
            defineField({
              name:        'latitude',
              title:       'Latitude',
              type:        'number',
              description: 'Decimal degrees — use with longitude for an exact pin on the Contact map.',
            }),
            defineField({
              name:        'longitude',
              title:       'Longitude',
              type:        'number',
              description: 'Decimal degrees — use with latitude.',
            }),
          ],
          preview: {
            select: { title: 'label', line1: 'addressLine1' },
            prepare({ title, line1 }: { title?: string; line1?: string }) {
              return { title: title || 'Location', subtitle: line1 }
            },
          },
        },
      ],
    }),
    defineField({ name: 'phone',       title: 'Phone number',  type: 'string' }),
    defineField({ name: 'email',       title: 'Contact email', type: 'string', initialValue: 'wichitapoloclub@gmail.com' }),
    defineField({
      name:        'googleMapsUrl',
      title:       'Google Maps URL (site-wide)',
      type:        'url',
      description: 'Optional. Overrides “Open in Maps” for all locations if a location does not set its own.',
    }),
    defineField({ name: 'instagramHandle', title: 'Instagram handle (no @)', type: 'string', initialValue: 'fairfieldpoloclub' }),
    defineField({ name: 'facebookUrl',    title: 'Facebook URL', type: 'url' }),
    defineField({ name: 'youtubeUrl',     title: 'YouTube channel URL', type: 'url' }),
    defineField({ name: 'foundedYear',    title: 'Year founded', type: 'number', initialValue: 1931 }),
    defineField({ name: 'uspaMember',     title: 'USPA member club?', type: 'boolean', initialValue: true }),

    // ─ Public polo schedule (used sitewide — update when game day / time / gates change)
    defineField({
      name:  'publicPoloWhen',
      title: 'Public polo — when (short line)',
      type:  'string',
      description:
        'Single sentence, e.g. when weekly matches are open to the public. Shown in Events strip, composed into subtitles, and appended after the lead line in the footer.',
      initialValue: 'Open to the public every Sunday at 1pm.',
    }),
    defineField({
      name:  'publicPoloNarrative',
      title: 'Public polo — home hero subhead',
      type:  'text',
      rows:  3,
      description: 'The paragraph under the main headline on the home page (USPA + watch live + public).',
      initialValue:
        'One of the oldest USPA clubs in America. Watch world-class polo every Sunday at 1pm — open to the public, free to attend.',
    }),
    defineField({
      name:  'publicGates',
      title: 'Gates (full line)',
      type:  'string',
      description: 'Used in schedule intro and combined with the address on the home events strip, e.g. “Gates open at noon for Sunday games.”',
      initialValue: 'Gates open at noon for Sunday games.',
    }),
    defineField({
      name:  'publicGatesStat',
      title: 'Gates (short, for callouts & stats)',
      type:  'string',
      description: 'Short version, e.g. “Gates open at noon” for the About stat grid, Contact, and the green strip on the home page.',
      initialValue: 'Gates open at noon',
    }),
    defineField({
      name:  'publicPoloTimeCallout',
      title: 'Time — “free admission” callout (home events strip H3)',
      type:  'string',
      initialValue: 'Sundays at 1:00 PM — Free Admission',
    }),
    defineField({
      name:  'publicPoloTimeContact',
      title: 'Time — contact / short display',
      type:  'string',
      initialValue: 'Sundays at 1:00 PM',
    }),
    defineField({
      name:  'publicPoloTimeDetail',
      title: 'Time — about “Public games” line',
      type:  'string',
      initialValue: 'Every Sunday at 1:00 PM (spring/summer)',
    }),
    defineField({
      name:  'publicPoloStatTime',
      title: 'Time — about stats grid (large number line)',
      type:  'string',
      initialValue: 'Sun 1pm',
    }),
    defineField({
      name:  'publicPoloSeo',
      title: 'SEO — schedule sentence (root meta / Open Graph)',
      type:  'string',
      description: 'Complements the main meta description. Often includes when you play, e.g. for search results and social share.',
      initialValue: 'Watch live polo every Sunday at 1pm in Haysville, Kansas.',
    }),
    defineField({
      name:  'publicPoloNoEvents',
      title: 'Copy — no upcoming events (home + events list)',
      type:  'string',
      initialValue: 'Check back soon — we play every Sunday at 1pm.',
    }),
    defineField({
      name:  'publicPoloEmptyEvents',
      title: 'Copy — no upcoming events (events page, longer)',
      type:  'string',
      initialValue: 'We play every Sunday at 1pm — check back soon for the season schedule.',
    }),
    defineField({
      name:  'publicPoloEmptySchedule',
      title: 'Copy — empty season schedule (schedule page)',
      type:  'string',
      initialValue: 'We play every Sunday at 1pm during the season.',
    }),
    defineField({
      name:  'publicPoloGetInvolved',
      title: 'About — “Watch polo” card body',
      type:  'text',
      rows:  3,
      initialValue:
        'Come out any Sunday at 1pm. Free admission, family friendly, bring lawn chairs or blankets. The field is wide open.',
    }),
    defineField({
      name:  'publicPoloScheduleCard',
      title: 'Schedule page — “Weekly matches” card body',
      type:  'text',
      rows:  4,
      initialValue:
        'Open matches are held every Sunday at 1:00 PM throughout the spring and summer season. Gates open at noon. Free admission — no tickets required. Bring chairs, blankets, and the family.',
    }),
    defineField({
      name:  'publicPoloWeatherNote',
      title: 'Weather & field conditions (home + events pages)',
      type:  'text',
      rows:  3,
      description:
        'Shown on the home page and all event pages. Use the words “this site” or “here” to link to the events schedule, and “Facebook” to link to your Facebook URL (set below).',
      initialValue:
        "We don't play when it's raining or the field is too muddy. Check for updates on this site or on Facebook before you head out.",
    }),
  ],
  preview: {
    prepare() { return { title: 'Site settings' } },
  },
})
