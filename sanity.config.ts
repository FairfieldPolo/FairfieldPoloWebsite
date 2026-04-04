import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { media } from 'sanity-plugin-media'
import {
  eventSchema,
  sponsorSchema,
  announcementSchema,
  educationArticleSchema,
  gallerySchema,
  siteSettingsSchema,
} from './schemas'

// Singleton types only ever have one document
const SINGLETON_TYPES = new Set(['siteSettings'])

export default defineConfig({
  name:    'fairfield-polo',
  title:   'Fairfield Polo Club',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,

  schema: {
    types: [
      eventSchema,
      sponsorSchema,
      announcementSchema,
      educationArticleSchema,
      gallerySchema,
      siteSettingsSchema,
    ],
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton — Site settings
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),

            S.divider(),

            // Events
            S.documentTypeListItem('event').title('Events'),

            S.divider(),

            // Announcements
            S.documentTypeListItem('announcement').title('Announcements'),

            S.divider(),

            // Education
            S.listItem()
              .title('Education')
              .child(
                S.list()
                  .title('Education')
                  .items([
                    S.documentTypeListItem('educationArticle').title('Articles'),
                  ])
              ),

            S.divider(),

            // Media
            S.documentTypeListItem('gallery').title('Photo gallery'),
            S.documentTypeListItem('sponsor').title('Sponsors'),
          ]),
    }),

    visionTool(),
    media(),
  ],

  document: {
    // Prevent deleting the singleton
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'unpublish')
        : prev,
  },
})
