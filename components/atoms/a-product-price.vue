<template>
  <SfPrice
    :regular="price.regular"
    :special="price.special"
  />
</template>
<script>
import { SfPrice } from '@storefront-ui/vue';
import { getProductPrice } from 'theme/helpers'
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
    price () {
      return getProductPrice(this.product, this.customOptions)
    }
  }
}
</script>
