<template>
  <SfPrice
    :regular="renderPrice.regular"
    :special="renderPrice.special"
  />
</template>
<script>
import { price } from '@vue-storefront/core/filters';
// TODO: uncomment after vsf 1.11.1 release
// import { getCustomOptionValues, getCustomOptionPriceDelta } from '@vue-storefront/core/modules/catalog/helpers/customOption'
// import { getBundleOptionsValues, getBundleOptionPrice } from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
import get from 'lodash-es/get'
import { SfPrice } from '@storefront-ui/vue';
export default {
  name: 'AProductPrice',
  components: {
    SfPrice
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    customOptions: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    bundleOptionsPrice () {
      // TODO: uncomment after vsf 1.11.1 release
      // const allBundeOptions = this.product.bundle_options || []
      // const selectedBundleOptions = Object.values(get(this.product, 'product_option.extension_attributes.bundle_options', {}))
      // const price = getBundleOptionPrice(
      //   getBundleOptionsValues(selectedBundleOptions, allBundeOptions)
      // )
      // return price
      return { priceInclTax: 0 } // TODO: remove after vsf 1.11.1 release
    },
    customOptionsPriceDelta () {
      // TODO: uncomment after vsf 1.11.1 release
      // const priceDelta = getCustomOptionPriceDelta(
      //   getCustomOptionValues(Object.values(this.customOptions), this.product.custom_options),
      //   this.product
      // )

      // return priceDelta
      return { priceInclTax: 0 } // TODO: remove after vsf 1.11.1 release
    },
    price () {
      const special = (this.productPrices.priceInclTax + this.customOptionsPriceDelta.priceInclTax) * this.product.qty
      const original = (this.productPrices.originalPriceInclTax + this.customOptionsPriceDelta.priceInclTax) * this.product.qty
      const defaultPrice = this.product.qty > 0
        ? (this.productPrices.priceInclTax + this.customOptionsPriceDelta.priceInclTax) * this.product.qty
        : this.productPrices.priceInclTax

      if (this.bundleOptionsPrice.priceInclTax > 0) {
        return {
          special,
          original,
          default: this.bundleOptionsPrice.priceInclTax
        }
      }

      return {
        special,
        original,
        default: defaultPrice
      }
    },
    isSpecialPrice () {
      return this.productPrices.specialPrice && this.productPrices.priceInclTax && this.productPrices.originalPriceInclTax
    },
    renderPrice () {
      return {
        regular: this.isSpecialPrice ? price(this.price.original) : price(this.price.default),
        special: this.isSpecialPrice ? price(this.price.special) : ''
      }
    },
    productPrices () {
      const priceInclTax = this.product.price_incl_tax || this.product.priceInclTax || 0
      const originalPriceInclTax = this.product.original_price_incl_tax || this.product.originalPriceInclTax || 0
      const specialPrice = this.product.special_price || this.product.specialPrice || 0
      return {
        priceInclTax,
        originalPriceInclTax,
        specialPrice
      }
    }
  }
}
</script>
