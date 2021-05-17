<template>
  <div class="m-product-additional-info">
    <sf-heading :title="$t('Additional Details')" :level="3" />
    <div class="m-product-additional-info__content" v-html="product.description" />
  </div>
</template>

<script>
import { SfHeading } from '@storefront-ui/vue';

export default {
  name: 'MProductAdditionalInfo',
  components: {
    SfHeading
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-product-additional-info {
  &__content {
    margin-top: var(--spacer-sm);
  }
}
</style>
