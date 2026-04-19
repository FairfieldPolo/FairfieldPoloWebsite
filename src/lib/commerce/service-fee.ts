/**
 * Optional convenience / service fee (display + optional cart line).
 *
 * Legal: Fees must comply with card network rules, state law, and your merchant agreements.
 * Review with counsel before charging convenience fees on card transactions.
 *
 * Flat fees: set MEDUSA_SERVICE_FEE_VARIANT_ID to a Medusa product variant whose price
 * matches the configured flat amount (or add line items via Admin — see README).
 *
 * Percentage fees: shown in UI as a separate line for transparency; syncing exact amounts
 * into Medusa may require a custom backend module or a priced variant — see README.
 */

export type ServiceFeeMode = 'off' | 'flat' | 'percent'

export type ServiceFeeConfig = {
  enabled: boolean
  mode: ServiceFeeMode
  /** Flat fee in major currency units (e.g. 2.50 USD) */
  flatAmount: number | null
  /** Percentage of merchandise subtotal (e.g. 3 for 3%) */
  percent: number | null
  label: string
}

export function getServiceFeeConfig(): ServiceFeeConfig {
  const enabled = process.env.NEXT_PUBLIC_SERVICE_FEE_ENABLED === 'true'
  const modeRaw = (process.env.NEXT_PUBLIC_SERVICE_FEE_MODE ?? 'off').toLowerCase()
  const mode: ServiceFeeMode =
    modeRaw === 'flat' ? 'flat' : modeRaw === 'percent' ? 'percent' : 'off'

  const flat = Number.parseFloat(process.env.NEXT_PUBLIC_SERVICE_FEE_FLAT_AMOUNT ?? '')
  const pct = Number.parseFloat(process.env.NEXT_PUBLIC_SERVICE_FEE_PERCENT ?? '')

  return {
    enabled: enabled && mode !== 'off',
    mode: enabled && mode !== 'off' ? mode : 'off',
    flatAmount: Number.isFinite(flat) && flat >= 0 ? flat : null,
    percent: Number.isFinite(pct) && pct >= 0 ? pct : null,
    label:
      process.env.NEXT_PUBLIC_SERVICE_FEE_LABEL?.trim() ||
      'Service fee',
  }
}

/** Merchandise subtotal in major units (from Medusa cart.item_subtotal or sum of lines). */
export function calculateServiceFeeAmount(
  config: ServiceFeeConfig,
  merchandiseSubtotal: number
): number {
  if (!config.enabled || config.mode === 'off') return 0
  if (config.mode === 'flat' && config.flatAmount != null) {
    return Math.round(config.flatAmount * 100) / 100
  }
  if (config.mode === 'percent' && config.percent != null) {
    const raw = (merchandiseSubtotal * config.percent) / 100
    return Math.round(raw * 100) / 100
  }
  return 0
}
