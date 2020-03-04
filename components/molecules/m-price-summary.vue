<template>
  <div class="m-price-summary">
    <SfProperty
      :name="$t('Subtotal')"
      :value="prices.subtotal | price"
      class="sf-property--full-width property"
    />
    <SfProperty
      :name="$t('Tax')"
      :value="prices.tax | price"
      class="sf-property--full-width property"
    />
    <SfProperty
      :name="$t('Shipping')"
      :value="prices.shipping | price"
      class="sf-property--full-width property"
    />
    <SfProperty
      v-if="prices.discount"
      :name="$t('Discount')"
      :value="prices.discount | price"
      class="sf-property--full-width property"
    />
    <SfProperty
      :name="$t('TOTAL')"
      :value="prices.grand_total | price"
      class="sf-property--full-width property-total"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SfProperty } from '@storefront-ui/vue';

export default {
  name: 'MPriceSummary',
  components: {
    SfProperty
  },
  computed: {
    ...mapGetters({
      totals: 'cart/getTotals'
    }),
    prices () {
      return this.totals.reduce((result, price) => {
        result[price.code] = price.value;
        return result;
      }, {});
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.property {
  margin-bottom: var(--spacer);
  ::v-deep .sf-property__name {
    color: var(--c-text-muted);
    text-transform: unset;
  }
}
.property-total {
  margin-top: var(--spacer-extra-big);
  font-size: var(--font-size-extra-big);
  font-weight: 500;
  ::v-deep .sf-property__name {
    color: var(--c-text);
  }
}
</style>
