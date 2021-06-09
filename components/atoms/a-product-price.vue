<template>
  <a-custom-price
    :regular="price.regular"
    :special-price="price.special"
  />
</template>

<script>
import ACustomPrice from '../atoms/a-custom-price.vue';
import { getProductPrice } from 'theme/helpers'

export default {
  name: 'AProductPrice',
  components: {
    ACustomPrice
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
      return getProductPrice(this.product, this.customOptions, false)
    }
  }
}
</script>
