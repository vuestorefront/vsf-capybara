import get from 'lodash-es/get'

import { price } from '@vue-storefront/core/filters';
import { getCustomOptionValues, getCustomOptionPriceDelta } from '@vue-storefront/core/modules/catalog/helpers/customOption'
import { getBundleOptionsValues, getBundleOptionPrice } from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

import UpdateProductDiscountPriceEventData, { UPDATE_PRODUCT_DISCOUNT_PRICE_DATA_EVENT_ID } from 'src/modules/shared/types/update-product-discount-price.event';

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

export function getProductDiscount (product, format = true) {
  const defaultDiscount = format ? '' : 0;
  if (!product) {
    return defaultDiscount;
  }

  const price = getProductPrice(product, {}, false);

  if (!price.special || price.regular === price.special) {
    return defaultDiscount;
  }

  const discount = Math.round((1 - price.special / price.regular) * 100);

  return format ? `-${discount}%` : discount;
}

export function getProductPrice (product, customOptions = {}, format = true) {
  if (!product) {
    return {
      regular: '',
      special: ''
    }
  }

  const productDiscountPriceData: UpdateProductDiscountPriceEventData = {
    value: undefined,
    product
  }

  EventBus.$emit(UPDATE_PRODUCT_DISCOUNT_PRICE_DATA_EVENT_ID, productDiscountPriceData);

  const productDiscountPrice = productDiscountPriceData.value;

  const priceInclTax = (product.giftcard_options && product.giftcard_options.price_amount) || product.price_incl_tax || product.priceInclTax || 0
  const originalPriceInclTax = (product.giftcard_options && product.giftcard_options.price_amount) || product.original_price_incl_tax || product.originalPriceInclTax || 0
  const specialPrice = product.special_price || product.specialPrice || 0

  const isDiscountPrice = !!productDiscountPrice;
  const isSpecialPrice = (specialPrice && priceInclTax && originalPriceInclTax)
  const priceDelta = calculateCustomOptionsPriceDelta(product, customOptions)

  const special = (priceInclTax + priceDelta) * product.qty || priceInclTax
  const original = (originalPriceInclTax + priceDelta) * product.qty || originalPriceInclTax
  const regular = (product.giftcard_options && product.giftcard_options.price_amount) * product.qty || product.regular_price || calculateBundleOptionsPrice(product) || (priceInclTax + priceDelta) * product.qty || priceInclTax

  if (!format) {
    return {
      regular: isSpecialPrice ? original : regular,
      special: isDiscountPrice ? productDiscountPrice : isSpecialPrice ? special : 0
    }
  }

  return {
    regular: isSpecialPrice ? formatPrice(original) : formatPrice(regular),
    special: isDiscountPrice ? formatPrice(productDiscountPrice) : isSpecialPrice ? formatPrice(special) : ''
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
