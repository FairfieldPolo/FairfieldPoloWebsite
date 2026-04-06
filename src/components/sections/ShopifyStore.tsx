'use client'

import Image from 'next/image'
import { useCallback, useEffect, useState } from 'react'

/**
 * Headless store section: full catalog + cart on this site; checkout on Shopify.
 * Shopify’s themed storefront cannot be iframed (X-Frame-Options: DENY).
 *
 * Env: SHOPIFY_STOREFRONT_TOKEN or NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN,
 * NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN (optional, defaults to fairfieldpolo.myshopify.com).
 */

const CART_STORAGE = 'fp-shopify-cart-id'
const DEFAULT_DOMAIN = 'fairfieldpolo.myshopify.com'

const STORE_DOMAIN = (
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim() || DEFAULT_DOMAIN
).replace(/^https?:\/\//, '')
const STORE_URL = `https://${STORE_DOMAIN}`

type StoreVariant = {
  id: string
  title: string
  availableForSale: boolean
  price: { amount: string; currencyCode: string }
  compareAtPrice: { amount: string; currencyCode: string } | null
}

type StoreProduct = {
  id: string
  title: string
  handle: string
  imageUrl: string | null
  imageAlt: string | null
  imageWidth: number | null
  imageHeight: number | null
  variants: StoreVariant[]
}

type CartLine = {
  id: string
  quantity: number
  title: string
  variantTitle: string
  imageUrl: string | null
  imageAlt: string | null
  price: { amount: string; currencyCode: string }
}

type CartState = {
  id: string
  checkoutUrl: string
  totalQuantity: number
  totalAmount: { amount: string; currencyCode: string }
  lines: CartLine[]
}

function formatMoney(amount: string, currencyCode: string) {
  const n = Number.parseFloat(amount)
  if (Number.isNaN(n)) return amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).format(n)
}

function firstSelectableVariant(p: StoreProduct) {
  return p.variants.find((v) => v.availableForSale) ?? p.variants[0]
}

export function ShopifyStore() {
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<StoreProduct[]>([])
  const [loadError, setLoadError] = useState<string | null>(null)
  const [notConfigured, setNotConfigured] = useState(false)

  const [cart, setCart] = useState<CartState | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [addingId, setAddingId] = useState<string | null>(null)
  const [variantPick, setVariantPick] = useState<Record<string, string>>({})

  const setStoredCart = useCallback((c: CartState | null) => {
    if (c?.id) {
      localStorage.setItem(CART_STORAGE, c.id)
    } else {
      localStorage.removeItem(CART_STORAGE)
    }
    setCart(c)
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch('/api/shopify/products')
        const data = await res.json()
        if (cancelled) return
        if (data.ok === false && data.error === 'not_configured') {
          setNotConfigured(true)
          setProducts([])
          return
        }
        if (!data.ok) {
          setLoadError(typeof data.error === 'string' ? data.error : 'Could not load products')
          setProducts([])
          return
        }
        const list: StoreProduct[] = data.products ?? []
        setProducts(list)
        const picks: Record<string, string> = {}
        for (const p of list) {
          const v = firstSelectableVariant(p)
          if (v) picks[p.id] = v.id
        }
        setVariantPick(picks)
      } catch {
        setLoadError('Could not load the store. Try again later.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const id = localStorage.getItem(CART_STORAGE)
    if (!id) return
    ;(async () => {
      try {
        const res = await fetch(`/api/shopify/cart?id=${encodeURIComponent(id)}`)
        const data = await res.json()
        if (data.ok && data.cart && data.cart.totalQuantity > 0) {
          setCart(data.cart)
        } else {
          localStorage.removeItem(CART_STORAGE)
        }
      } catch {
        localStorage.removeItem(CART_STORAGE)
      }
    })()
  }, [])

  const addToCart = async (product: StoreProduct) => {
    const vid = variantPick[product.id]
    const variant = product.variants.find((v) => v.id === vid)
    if (!variant?.availableForSale) return
    setAddingId(product.id)
    try {
      const res = await fetch('/api/shopify/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operation: 'merge',
          cartId: cart?.id ?? null,
          lines: [{ merchandiseId: variant.id, quantity: 1 }],
        }),
      })
      const data = await res.json()
      if (data.ok && data.cart) {
        setStoredCart(data.cart)
        setCartOpen(true)
      }
    } finally {
      setAddingId(null)
    }
  }

  const removeLine = async (lineId: string) => {
    if (!cart?.id) return
    const res = await fetch('/api/shopify/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        operation: 'remove',
        cartId: cart.id,
        lineIds: [lineId],
      }),
    })
    const data = await res.json()
    if (!data.ok) return
    if (data.cart && data.cart.totalQuantity > 0) {
      setStoredCart(data.cart)
    } else {
      setStoredCart(null)
    }
  }

  const checkout = () => {
    if (cart?.checkoutUrl) window.location.href = cart.checkoutUrl
  }

  if (notConfigured) {
    return (
      <section className="section-cream section-pad">
        <div className="container-polo">
          <div className="text-center py-16 md:py-20 px-6 bg-white border border-polo-cream-dark rounded-sm max-w-2xl mx-auto">
            <div className="font-display text-2xl md:text-3xl text-polo-green mb-3">
              Online gift shop
            </div>
            <p className="font-body text-gray-600 mb-8 leading-relaxed">
              Shop official Fairfield Polo merchandise — apparel, gifts, and more — at our
              online store. Checkout is secure and handled by Shopify.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex"
              >
                Open Shopify store ↗
              </a>
              <a href="/contact" className="btn-outline inline-flex">
                Inquire about merchandise
              </a>
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="section-cream section-pad pb-32">
        <div className="container-polo">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-square bg-polo-cream-dark" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-polo-cream-dark rounded w-3/4" />
                  <div className="h-4 bg-polo-cream-dark rounded w-1/3" />
                  <div className="h-10 bg-polo-cream-dark rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (loadError) {
    return (
      <section className="section-cream section-pad">
        <div className="container-polo text-center py-16">
          <p className="font-body text-gray-600 mb-6">{loadError}</p>
          <a href={STORE_URL} className="btn-outline inline-flex" target="_blank" rel="noopener noreferrer">
            Browse store on Shopify ↗
          </a>
        </div>
      </section>
    )
  }

  const hasProducts = products.length > 0
  const cartQty = cart?.totalQuantity ?? 0

  return (
    <>
      <section className="section-cream section-pad pb-40 md:pb-36">
        <div className="container-polo">
          {!hasProducts ? (
            <div className="text-center py-16 max-w-lg mx-auto">
              <p className="font-body text-gray-600 mb-6">
                No products are listed yet. When you add inventory in Shopify, it will appear
                here automatically.
              </p>
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold inline-flex"
              >
                Visit Shopify store ↗
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((p) => {
                const selectedId = variantPick[p.id]
                const selected = p.variants.find((v) => v.id === selectedId)
                const canAdd = Boolean(selected?.availableForSale)
                const showCompare =
                  selected?.compareAtPrice &&
                  Number.parseFloat(selected.compareAtPrice.amount) >
                    Number.parseFloat(selected.price.amount)

                return (
                  <article key={p.id} className="card flex flex-col overflow-hidden">
                    <div className="relative aspect-square bg-polo-cream-dark">
                      {p.imageUrl ? (
                        <Image
                          src={p.imageUrl}
                          alt={p.imageAlt || p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center font-display text-polo-green/25 text-lg">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h2 className="font-display text-xl text-polo-green leading-snug mb-2">
                        {p.title}
                      </h2>
                      {p.variants.length > 1 ? (
                        <label className="block mb-3">
                          <span className="sr-only">Options</span>
                          <select
                            className="input-polo text-sm py-2 w-full"
                            value={selectedId ?? ''}
                            onChange={(e) =>
                              setVariantPick((prev) => ({
                                ...prev,
                                [p.id]: e.target.value,
                              }))
                            }
                          >
                            {p.variants.map((v) => (
                              <option key={v.id} value={v.id} disabled={!v.availableForSale}>
                                {v.title !== 'Default Title' ? v.title : 'Standard'} —{' '}
                                {formatMoney(v.price.amount, v.price.currencyCode)}
                                {!v.availableForSale ? ' (sold out)' : ''}
                              </option>
                            ))}
                          </select>
                        </label>
                      ) : null}
                      {selected ? (
                        <div className="mb-4 font-body text-sm text-polo-charcoal">
                          {showCompare && selected.compareAtPrice ? (
                            <span className="text-gray-400 line-through mr-2">
                              {formatMoney(
                                selected.compareAtPrice.amount,
                                selected.compareAtPrice.currencyCode
                              )}
                            </span>
                          ) : null}
                          <span className="font-semibold">
                            {formatMoney(selected.price.amount, selected.price.currencyCode)}
                          </span>
                        </div>
                      ) : null}

                      <div className="mt-auto pt-2">
                        <button
                          type="button"
                          className="btn-primary w-full justify-center disabled:opacity-50 disabled:pointer-events-none"
                          disabled={!canAdd || addingId === p.id}
                          onClick={() => addToCart(p)}
                        >
                          {addingId === p.id ? 'Adding…' : canAdd ? 'Add to cart' : 'Sold out'}
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {hasProducts ? (
            <p className="text-center font-body text-xs text-gray-400 mt-12 max-w-2xl mx-auto">
              Secure checkout on Shopify. You can also open the{' '}
              <a
                href={STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-polo-green hover:underline"
              >
                full storefront
              </a>{' '}
              in a new tab.
            </p>
          ) : null}
        </div>
      </section>

      {cart && cartQty > 0 ? (
        <div
          className="fixed inset-x-0 bottom-0 z-40 border-t border-polo-cream-dark bg-white/95 backdrop-blur shadow-[0_-4px_24px_rgba(0,0,0,0.08)]"
          role="region"
          aria-label="Shopping cart"
        >
          <div className="container-polo py-3 md:py-4">
            <button
              type="button"
              className="md:hidden w-full flex items-center justify-between text-left font-body text-sm text-polo-charcoal mb-2"
              onClick={() => setCartOpen((o) => !o)}
              aria-expanded={cartOpen}
            >
              <span>
                <strong>{cartQty}</strong> {cartQty === 1 ? 'item' : 'items'} ·{' '}
                {formatMoney(cart.totalAmount.amount, cart.totalAmount.currencyCode)}
              </span>
              <span className="text-polo-gold">{cartOpen ? 'Hide' : 'View bag'}</span>
            </button>

            <div
              className={`
                ${cartOpen ? 'max-h-[50vh] overflow-y-auto mb-3 border-b border-polo-cream-dark pb-3' : 'hidden'}
                md:block md:max-h-none md:overflow-visible md:mb-0 md:border-0 md:pb-0
              `}
            >
              <ul className="space-y-3 md:max-h-48 md:overflow-y-auto md:pr-1">
                {cart.lines.map((line) => (
                  <li
                    key={line.id}
                    className="flex gap-3 items-center font-body text-sm text-polo-charcoal"
                  >
                    <div className="relative w-14 h-14 flex-shrink-0 bg-polo-cream-dark rounded-sm overflow-hidden">
                      {line.imageUrl ? (
                        <Image
                          src={line.imageUrl}
                          alt={line.imageAlt || line.title}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate">{line.title}</div>
                      {line.variantTitle && line.variantTitle !== 'Default Title' ? (
                        <div className="text-xs text-gray-500 truncate">{line.variantTitle}</div>
                      ) : null}
                      <div className="text-xs text-gray-500">
                        Qty {line.quantity} ·{' '}
                        {formatMoney(line.price.amount, line.price.currencyCode)} each
                      </div>
                    </div>
                    <button
                      type="button"
                      className="text-xs text-red-700 hover:underline flex-shrink-0"
                      onClick={() => removeLine(line.id)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="hidden md:block font-body text-polo-charcoal">
                <span className="text-gray-500 mr-2">Subtotal</span>
                <span className="font-semibold text-lg">
                  {formatMoney(cart.totalAmount.amount, cart.totalAmount.currencyCode)}
                </span>
                <span className="text-gray-500 text-sm ml-2">
                  ({cartQty} {cartQty === 1 ? 'item' : 'items'})
                </span>
              </div>
              <button type="button" className="btn-gold w-full sm:w-auto justify-center" onClick={checkout}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
