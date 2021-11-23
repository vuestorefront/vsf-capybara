import get from 'lodash-es/get'

import { isBundleProduct } from '@vue-storefront/core/modules/catalog/helpers';
import { price } from '@vue-storefront/core/filters';
import { getCustomOptionValues, getCustomOptionPriceDelta } from '@vue-storefront/core/modules/catalog/helpers/customOption'
import { getBundleOptionsValues, getBundleOptionPrice } from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus'

import UpdateProductDiscountPriceEventData, { UPDATE_PRODUCT_DISCOUNT_PRICE_DATA_EVENT_ID } from 'src/modules/shared/types/update-product-discount-price.event';

interface ProductPriceData {
  originalPriceInclTax: number,
  priceInclTax: number,
  specialPrice: number
}

function calculateBundleOptionsPrice (product) {
  const allBundleOptions = product.bundle_options || []
  const selectedBundleOptions = Object.values(get(product, 'product_option.extension_attributes.bundle_options', {}))
  const price = getBundleOptionPrice(
    getBundleOptionsValues(selectedBundleOptions as any[], allBundleOptions)
  )

  return price
}

function getProductPriceData (product): ProductPriceData {
  let productPriceData: ProductPriceData = {
    originalPriceInclTax: 0,
    priceInclTax: 0,
    specialPrice: 0
  }

  if (isBundleProduct(product)) {
    productPriceData = calculateBundleOptionsPrice(product);
  } else if (product.giftcard_options) {
    productPriceData.priceInclTax = product.giftcard_options.price_amount;
    productPriceData.originalPriceInclTax = product.giftcard_options.price_amount;
  } else {
    productPriceData.priceInclTax = product.price_incl_tax || product.priceInclTax || 0
    productPriceData.originalPriceInclTax = product.original_price_incl_tax || product.originalPriceInclTax || 0
    productPriceData.specialPrice = product.special_price || product.specialPrice || 0
  }

  return productPriceData;
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
  const productPriceData = getProductPriceData(product);

  let priceInclTax = productPriceData.priceInclTax;
  let originalPriceInclTax = productPriceData.originalPriceInclTax;
  let specialPrice = productPriceData.specialPrice;

  const isSpecialPrice = !!productDiscountPrice || (specialPrice && priceInclTax && originalPriceInclTax)
  const priceDelta = calculateCustomOptionsPriceDelta(product, customOptions)

  const special = productDiscountPrice || (priceInclTax + priceDelta) * product.qty || priceInclTax
  const original = (originalPriceInclTax + priceDelta) * product.qty || originalPriceInclTax
  const regular = (priceInclTax + priceDelta) * product.qty || product.regular_price || priceInclTax

  if (!format) {
    return {
      regular: isSpecialPrice ? original : regular,
      special: isSpecialPrice ? special : 0
    }
  }

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
