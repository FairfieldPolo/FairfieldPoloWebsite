'use client'

import { useEffect } from 'react'

// Shopify Buy Button setup:
// 1. Create a Shopify store at shopify.com (free trial → Basic plan)
// 2. Go to Sales Channels → Buy Button
// 3. Create a "Collection" button for your whole store
// 4. Copy the generated script — paste the collection ID and store domain below
// 5. Set NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN and NEXT_PUBLIC_SHOPIFY_COLLECTION_ID in .env

const STORE_DOMAIN   = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? ''
const COLLECTION_ID  = process.env.NEXT_PUBLIC_SHOPIFY_COLLECTION_ID ?? ''
const STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN ?? ''

export function ShopifyStore() {
  useEffect(() => {
    if (!STORE_DOMAIN || !COLLECTION_ID || !STOREFRONT_TOKEN) return

    // Load Shopify Buy Button SDK
    const script = document.createElement('script')
    script.async = true
    script.src   = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js'
    script.onload = initShopify
    document.head.appendChild(script)

    function initShopify() {
      const w = window as Window & {
        ShopifyBuy?: {
          buildClient: (opts: object) => object
          UI: { onReady: (client: object, cb: (ui: { createComponent: (type: string, opts: object) => void }) => void) => void }
        }
      }
      if (!w.ShopifyBuy?.UI) return

      const client = w.ShopifyBuy.buildClient({
        domain: STORE_DOMAIN,
        storefrontAccessToken: STOREFRONT_TOKEN,
      })

      w.ShopifyBuy.UI.onReady(client, (ui) => {
        ui.createComponent('collection', {
          id: COLLECTION_ID,
          node: document.getElementById('shopify-collection'),
          moneyFormat: '%24%7B%7Bamount%7D%7D',
          options: {
            product: {
              styles: {
                product: {
                  '@media (min-width: 601px)': { 'max-width': 'calc(25% - 20px)', 'margin-left': '20px', 'margin-bottom': '50px' },
                  'img': { height: 'calc(100% - 15px)', position: 'absolute', left: '0', right: '0', top: '0' },
                  'imgWrapper': { 'padding-top': 'calc(75% + 15px)', position: 'relative', height: '0' },
                },
                title: { 'font-family': 'Playfair Display, Georgia, serif', color: '#1a3a2a' },
                button: {
                  'font-family': 'Inter, system-ui, sans-serif',
                  'font-weight': '500',
                  color: '#f8f4ed',
                  background: '#1a3a2a',
                  ':hover': { background: '#2d5a3d' },
                  ':focus': { background: '#2d5a3d' },
                },
                price: { color: '#1a3a2a', 'font-family': 'Inter, system-ui, sans-serif' },
              },
              text: { button: 'Add to cart' },
            },
            collection: {
              styles: {
                products: {
                  '@media (min-width: 601px)': { 'margin-left': '-20px' },
                },
              },
            },
            cart: {
              styles: {
                button: {
                  'font-family': 'Inter, system-ui, sans-serif',
                  background: '#c9a84c',
                  ':hover': { background: '#e8c97a' },
                  color: '#1c1c1c',
                },
              },
              text: {
                total: 'Subtotal',
                button: 'Checkout',
              },
            },
          },
        })
      })
    }

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  // Not configured yet — show placeholder
  if (!STORE_DOMAIN || !COLLECTION_ID) {
    return (
      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="text-center py-20 bg-white border border-polo-cream-dark rounded-sm">
            <div className="font-display text-3xl text-polo-green/20 mb-3">Store coming soon</div>
            <p className="font-body text-gray-400 mb-6">
              Our online store is being set up. Check back soon for official club merchandise.
            </p>
            <a href="/contact" className="btn-outline inline-flex">
              Inquire about merchandise
            </a>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section-cream section-pad">
      <div className="container-polo">
        <div id="shopify-collection" className="min-h-64" />
        <p className="text-center font-body text-xs text-gray-400 mt-8">
          Secure checkout powered by Shopify.{' '}
          <a
            href={`https://${STORE_DOMAIN}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-polo-green transition-colors"
          >
            Visit full store →
          </a>
        </p>
      </div>
    </section>
  )
}
