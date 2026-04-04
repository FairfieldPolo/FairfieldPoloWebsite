// This embeds the Sanity Studio at /studio
// Only accessible to authenticated users in production
// Access at: http://localhost:3000/studio (dev)
//            https://yoursite.com/studio (prod — protect with auth in Tier 3)

export { default } from 'next-sanity/studio'

export const dynamic = 'force-dynamic'
