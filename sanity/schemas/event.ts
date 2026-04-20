import { defineType, defineField } from 'sanity'

export const eventSchema = defineType({
  name:  'event',
  title: 'Event',
  type:  'document',
  icon: () => '📅',
  fields: [
    defineField({
      name:       'title',
      title:      'Event title',
      type:       'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name:       'slug',
      title:      'URL slug',
      type:       'slug',
      options:    { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name:       'date',
      title:      'Start date & time',
      type:       'datetime',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name:  'endDate',
      title: 'End date & time (optional)',
      type:  'datetime',
    }),
    defineField({
      name:    'eventType',
      title:   'Event type',
      type:    'string',
      options: {
        list: [
          { title: 'Match (public)',      value: 'match' },
          { title: 'Tournament',          value: 'tournament' },
          { title: 'Charity event',       value: 'charity' },
          { title: 'Private event',       value: 'private' },
          { title: 'Practice',            value: 'practice' },
        ],
        layout: 'radio',
      },
      initialValue: 'match',
      validation:   Rule => Rule.required(),
    }),
    defineField({
      name:  'isPublic',
      title: 'Open to the public?',
      type:  'boolean',
      initialValue: true,
    }),
    defineField({
      name:  'isFeatured',
      title: 'Feature on homepage?',
      type:  'boolean',
      initialValue: false,
    }),
    defineField({
      name:  'image',
      title: 'Event image',
      type:  'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'string' }),
      ],
    }),
    defineField({
      name:  'shortDescription',
      title: 'Short description (card / preview)',
      type:  'text',
      rows:  2,
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name:  'description',
      title: 'Full description',
      type:  'array',
      of:    [{ type: 'block' }],
    }),
    defineField({
      name:        'venue',
      title:       'Where',
      type:        'reference',
      to:          [{ type: 'venue' }],
      description: 'Pick where this happens. Create venues under **Locations** in the sidebar if needed.',
    }),
    defineField({
      name:        'location',
      title:       'Location notes (optional)',
      type:        'string',
      description: 'Extra directions only — e.g. “Field B, park by the barn.” Shown with the selected location.',
    }),
    defineField({
      name:        'admissionFee',
      title:       'Admission fee',
      type:        'string',
      placeholder: 'e.g. Free, $10 per car, $25 per person',
    }),
    defineField({
      name:  'ticketUrl',
      title: 'Ticket / registration URL',
      type:  'url',
    }),
    defineField({
      name:  'sponsors',
      title: 'Event sponsors',
      type:  'array',
      of:    [{ type: 'reference', to: [{ type: 'sponsor' }] }],
    }),
  ],
  preview: {
    select: {
      title:      'title',
      date:       'date',
      type:       'eventType',
      featured:   'isFeatured',
      media:      'image',
      venueLabel: 'venue.label',
    },
    prepare({ title, date, type, featured, media, venueLabel }) {
      const d = date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''
      const place = venueLabel ? ` · ${venueLabel}` : ''
      return {
        title:    `${featured ? '★ ' : ''}${title}`,
        subtitle: `${d} · ${type}${place}`,
        media,
      }
    },
  },
  orderings: [
    { title: 'Date (upcoming first)', name: 'dateAsc',  by: [{ field: 'date', direction: 'asc' }] },
    { title: 'Date (newest first)',   name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
})
