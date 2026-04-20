import { defineType, defineField } from 'sanity'

/** Reusable place (main field, off-site arena, etc.) — events reference this for “Where”. */
export const venueSchema = defineType({
  name:  'venue',
  title: 'Location',
  type:  'document',
  icon:  () => '📍',
  fields: [
    defineField({
      name:        'label',
      title:       'Name',
      type:        'string',
      description: 'e.g. Main field, Off-site arena',
      validation:  Rule => Rule.required(),
    }),
    defineField({ name: 'addressLine1', title: 'Street address', type: 'string' }),
    defineField({ name: 'addressLine2', title: 'City, state, ZIP', type: 'string' }),
    defineField({
      name:        'googleMapsUrl',
      title:       'Optional: Google Maps link',
      type:        'url',
      description: '“Open in Maps” for this venue; otherwise a search link is built from the address.',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'addressLine1' },
  },
})
