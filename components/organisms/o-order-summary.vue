<template>
  <div class="o-order-summary">
    <SfHeading
      :title="$t('Totals')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <MPriceSummary :is-large="true" />
    <APromoCode :allow-promo-code-removal="false" />
  </div>
</template>
<script>
import { SfHeading } from '@storefront-ui/vue';
import APromoCode from 'theme/components/atoms/a-promo-code';
import MPriceSummary from 'theme/components/molecules/m-price-summary';
export default {
  name: 'OOrderSummary',
  components: {
    SfHeading,
    APromoCode,
    MPriceSummary
  }
};
</script>
<style lang="scss" scoped>
.title {
  --heading-title-margin: 0 0 var(--spacer-2xl) 0;
}
.property {
  margin: var(--spacer-base) 0;
}
.actions {
  &__button {
    margin: var(--spacer-sm) 0;
    &--secondary {
      text-align: left;
    }
  }
}
</style>
