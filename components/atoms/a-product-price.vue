<template>
  <SfPrice
    regular="$50.00"
  />
</template>
<script>
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
    }
  }
}
</script>
