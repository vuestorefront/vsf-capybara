<template>
  <SfPrice
    :regular="formattedRegularPrice"
    :special="formattedSpecialPrice"
  >
    <template #special="{ special }">
      <ins v-if="special" class="sf-price__special">{{ special }}</ins>
      <ins v-if="special" class="sf-price__saved-value">
        (Save {{ saveAmount | price() }} |
        {{ savePercent }}%)
      </ins>
    </template>
  </SfPrice>
</template>

<script lang="ts">
import Vue from 'vue';
import { SfPrice } from '@storefront-ui/vue';
import { price as priceFormatter } from '@vue-storefront/core/filters';

export default Vue.extend({
  name: 'ACustomPrice',
  components: {
    SfPrice
  },
  props: {
    regular: {
      type: Number,
      required: true
    },
    specialPrice: {
      type: Number,
      default: 0
    }
  },
  computed: {
    formattedRegularPrice (): string {
      return this.formatPrice(this.regular);
    },
    formattedSpecialPrice (): string {
      return this.formatPrice(this.specialPrice);
    },
    saveAmount (): number {
      return this.regular - this.specialPrice;
    },
    savePercent (): number {
      return Math.round(
        ((this.regular - this.specialPrice) / this.regular) * 100
      );
    }
  },
  methods: {
    formatPrice (value: number): string {
      return value ? priceFormatter(value) : ''
    }
  }
})
</script>

<style lang="scss" scoped>
.sf-price {
  ::v-deep &__special {
    margin: var(--price-old-margin, 0 var(--spacer-xs) 0 0);
  }

  ::v-deep  &__saved-value {
    color: var(--price-special-color, var(--c-text));
    font: var(--price-special-font, var(--price-special-font-weight, var(--font-medium)) var(--price-special-font-size, var(--font-lg))/var(--price-special-font-line-height, 1.6) var(--price-special-font-family, var(--font-family-secondary)));
    font-size: 1em;
    text-decoration: var(--price-special-text-decoration, none);
  }
}
</style>
