import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import {
  eventSchema,
  venueSchema,
  sponsorSchema,
  announcementSchema,
  educationArticleSchema,
  gallerySchema,
  siteSettingsSchema,
  poloMatchSchema,
} from './sanity/schemas'

const SINGLETON_TYPES = new Set(['siteSettings'])

export default defineConfig({
  name:    'fairfield-polo',
  title:   'Fairfield Polo Club',
  basePath: '/studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset:   process.env.NEXT_PUBLIC_SANITY_DATASET!,

  schema: {
    types: [
      venueSchema,
      eventSchema,
      poloMatchSchema,
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
            S.listItem()
              .title('Site settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.divider(),
            S.documentTypeListItem('venue').title('Locations'),
            S.documentTypeListItem('event').title('Events'),
            S.documentTypeListItem('poloMatch').title('Polo matches (scoreboard)'),
            S.divider(),
            S.documentTypeListItem('announcement').title('Announcements'),
            S.divider(),
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
            S.documentTypeListItem('gallery').title('Photo gallery'),
            S.documentTypeListItem('sponsor').title('Sponsors'),
          ]),
    }),
    visionTool(),
  ],

  document: {
    actions: (prev, { schemaType }) =>
      SINGLETON_TYPES.has(schemaType)
        ? prev.filter(({ action }) => action !== 'delete' && action !== 'unpublish')
        : prev,
  },
})
