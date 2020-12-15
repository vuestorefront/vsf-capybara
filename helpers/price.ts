import { price } from '@vue-storefront/core/filters';
import { getCustomOptionValues, getCustomOptionPriceDelta } from '@vue-storefront/core/modules/catalog/helpers/customOption'
import { getBundleOptionsValues, getBundleOptionPrice } from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
import get from 'lodash-es/get'

function calculateBundleOptionsPrice (product) {
  const allBundleOptions = product.bundle_options || []
  const selectedBundleOptions = Object.values(get(product, 'product_option.extension_attributes.bundle_options', {}))
  const price = getBundleOptionPrice(
    getBundleOptionsValues(selectedBundleOptions as any[], allBundleOptions)
  )

  return price.priceInclTax
}

function calculateCustomOptionsPriceDelta (product, customOptions) {
  const priceDelta = getCustomOptionPriceDelta(
    getCustomOptionValues(Object.values(customOptions), product.custom_options),
    product
  )

  return priceDelta.priceInclTax
}

function formatPrice (value) {
  return value ? price(value) : ''
}

export function getProductPrice (product, customOptions = {}) {
  if (!product) {
    return {
      regular: '',
      special: ''
    }
  }

  const priceInclTax = product.price_incl_tax || product.priceInclTax || 0
  const originalPriceInclTax = product.original_price_incl_tax || product.originalPriceInclTax || 0
  const specialPrice = product.special_price || product.specialPrice || 0

  const isSpecialPrice = specialPrice && priceInclTax && originalPriceInclTax
  const priceDelta = calculateCustomOptionsPriceDelta(product, customOptions)

  const special = (priceInclTax + priceDelta) * product.qty || priceInclTax
  const original = (originalPriceInclTax + priceDelta) * product.qty || originalPriceInclTax
  const regular = product.regular_price || calculateBundleOptionsPrice(product) || (priceInclTax + priceDelta) * product.qty || priceInclTax

  return {
    regular: isSpecialPrice ? formatPrice(original) : formatPrice(regular),
    special: isSpecialPrice ? formatPrice(special) : ''
  }
}

export function getProductPriceFromTotals (product) {
  if (!product.totals || !product.totals.options) {
    return {
      regular: '',
      special: ''
    }
  }

  const isSpecialPrice = product.totals.discount_amount > 0

  const special = product.totals.row_total_incl_tax - product.totals.discount_amount
  const regular = product.totals.row_total_incl_tax

  return {
    regular: formatPrice(regular),
    special: isSpecialPrice ? formatPrice(special) : ''
  }
}
