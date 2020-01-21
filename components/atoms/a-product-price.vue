<template>
  <SfPrice
    :regular="renderPrice.regular"
    :special="renderPrice.special"
  />
</template>
<script>
import { price } from '@vue-storefront/core/filters';
import { getCustomOptionValues, getCustomOptionPriceDelta } from '@vue-storefront/core/modules/catalog/helpers/customOption'
import { getBundleOptionsValues, getBundleOptionPrice } from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
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
      const allBundeOptions = this.product.bundle_options || []
      const selectedBundleOptions = Object.values(get(this.product, 'product_option.extension_attributes.bundle_options', {}))
      const price = getBundleOptionPrice(
        getBundleOptionsValues(selectedBundleOptions, allBundeOptions)
      )
      return price
    },
    customOptionsPriceDelta () {
      const priceDelta = getCustomOptionPriceDelta(
        getCustomOptionValues(Object.values(this.customOptions), this.product.custom_options),
        this.product
      )

      return priceDelta
    },
    price () {
      const special = (this.product.price_incl_tax + this.customOptionsPriceDelta.priceInclTax) * this.product.qty
      const original = (this.product.original_price_incl_tax + this.customOptionsPriceDelta.priceInclTax) * this.product.qty
      const defaultPrice = this.product.qty > 0
        ? (this.product.price_incl_tax + this.customOptionsPriceDelta.priceInclTax) * this.product.qty
        : this.product.price_incl_tax

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
      return this.product.special_price && this.product.price_incl_tax && this.product.original_price_incl_tax
    },
    renderPrice () {
      return {
        regular: this.isSpecialPrice ? price(this.price.original) : price(this.price.default),
        special: this.isSpecialPrice ? price(this.price.special) : ''
      }
    }
  }
}
</script>
