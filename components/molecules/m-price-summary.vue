<template>
  <div class="m-price-summary">
    <SfProperty
      :name="$t('Products')"
      :value="totalItems"
      class="sf-property--full-width property"
      :class="{'sf-property--large': isLarge}"
    />
    <SfProperty
      v-if="prices.subtotal"
      :name="$t('Subtotal')"
      :value="prices.subtotal | price"
      class="sf-property--full-width property"
      :class="{'sf-property--large': isLarge}"
    />
    <SfProperty
      v-if="prices.subtotal_incl_tax"
      :name="$t('Subtotal Incl Tax')"
      :value="prices.subtotal_incl_tax | price"
      class="sf-property--full-width property"
      :class="{'sf-property--large': isLarge}"
    />
    <SfProperty
      v-if="prices.tax || prices.tax === 0"
      :name="$t('Tax')"
      :value="prices.tax | price"
      class="sf-property--full-width property"
      :class="{'sf-property--large': isLarge}"
    />
    <SfProperty
      v-if="prices.shipping || prices.shipping === 0"
      :name="$t('Shipping')"
      :value="prices.shipping | price"
      class="sf-property--full-width property"
      :class="{'sf-property--large': isLarge}"
    />
    <template v-if="prices.discount">
      <SfProperty
        :name="$t('Discount')"
        :value="prices.discount | price"
        class="sf-property--full-width property"
        :class="{'sf-property--large': isLarge}"
      />
      <SfButton
        class="sf-button sf-button--outline promo-code__button"
        @click="removeCoupon"
      >
        {{ $t("Delete discount code") }}
      </SfButton>
    </template>
    <SfDivider class="divider" />
    <SfProperty
      :name="$t('Total')"
      :value="prices.grand_total | price"
      class="sf-property--full-width property"
      :class="{'sf-property--large': isLarge}"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { SfProperty, SfDivider } from '@storefront-ui/vue';

export default {
  name: 'MPriceSummary',
  components: {
    SfProperty,
    SfDivider
  },
  props: {
    isLarge: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      totals: 'cart/getTotals',
      productsInCart: 'cart/getCartItems'
    }),
    prices () {
      return this.totals.reduce((result, price) => {
        result[price.code] = price.value;
        return result;
      }, {});
    },
    totalItems () {
      return this.productsInCart.reduce((result, product) => {
        return result + product.qty;
      }, 0);
    }
  },
  methods: {
    removeCoupon () {
      this.$store.dispatch('cart/removeCoupon');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.property {
  margin: 0 0 var(--spacer-base) 0;
  @include for-desktop {
    margin: 0 0 var(--spacer-sm) 0;
    &__total {
      padding: var(--spacer-base) 0 0 0;
    }
  }
}
.divider {
  --divider-border-color: var(--c-white);
  --divider-width: 100%;
  --divider-margin: 0 0 var(--spacer-base) 0;
}
.promo-code {
  &__button {
    --button-height: 2rem;
    --button-font-size: 0.6875rem;
    margin: 1rem 0;
  }
}
</style>
