<template>
  <div class="detailed-cart-order-summary">
    <SfHeading
      title="Totals"
      :level="2"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="highlighted highlighted--total">
      <SfProperty
        name="Products"
        :value="totalItems"
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        name="Subtotal"
        :value="subtotal"
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        name="Shipping"
        v-if="cheapestShippingMethod.price !== undefined"
        :value="`From $${cheapestShippingMethod.price.toFixed(2)}`"
        class="sf-property--full-width sf-property--large property"
      />
      <SfDivider class="divider" />
      <SfProperty
        name="Total price"
        :value="total"
        class="sf-property--full-width sf-property--large property property__total"
      />
    </div>
    <div class="actions">
      <APromoCode :allow-promo-code-removal="false" />
      <SfButton
        class="sf-button--full-width actions__button"
        @click="goToCheckout"
      >
        Go to checkout
      </SfButton>
    </div>
    <SfLoader :loading="isUpdatingQuantity" />
  </div>
</template>
<script>
import {
  SfLoader,
  SfHeading,
  SfButton,
  SfProperty,
  SfDivider
} from '@storefront-ui/vue';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getProductPrice, getProductPriceFromTotals } from 'theme/helpers';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import APromoCode from 'theme/components/atoms/a-promo-code.vue'
export default {
  name: 'OrderSummary',
  components: {
    SfLoader,
    APromoCode,
    SfHeading,
    SfButton,
    SfDivider,
    SfProperty
  },
  props: {
    order: {
      type: Object,
      default: () => ({})
    },
    products: {
      type: Array,
      default: () => []
    },
    shippingMethods: {
      type: Array,
      default: () => []
    },
    totalItems: {
      type: Number,
      default: null
    },
    isUpdatingQuantity: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    cheapestShippingMethod () {
      const methods = this.shippingMethods.filter(
        (method) => method.price !== 'Free'
      );
      const cheapestMethod = methods.reduce((previous, current) => {
        return current.price < previous.price ? current : previous;
      });
      return cheapestMethod;
    },
    subtotal () {
      const products = this.products;
      const subtotal = products.reduce((previous, current) => {
        const productPrice = this.getProductPrice(current)
        const price = productPrice.special
          ? productPrice.special
          : productPrice.regular;
        const total = parseFloat(price.replace('$', ''));
        return previous + total;
      }, 0);
      return '$' + subtotal.toFixed(2);
    },
    total () {
      const subtotal = parseFloat(this.subtotal.replace('$', ''));
      const shipping = this.cheapestShippingMethod.price;
      const total = subtotal + (isNaN(shipping) ? 0 : shipping);
      return '$' + total.toFixed(2);
    }
  },
  methods: {
    getProductPrice (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? getProductPriceFromTotals(product)
        : getProductPrice(product);
    },
    goToCheckout () {
      this.$router.push(localizedRoute('/checkout'));
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.detailed-cart-order-summary {
  position: relative;
  background: var(--c-light);
  padding: var(--spacer-xl);

  .title {
    @include for-desktop {
      --heading-title-margin: 0 0 var(--spacer-2xl) 0;
      --heading-title-font-size: var(--h3-font-size);
      --heading-title-font-weight: var(--font-semibold);
    }
  }
  .property {
    margin: var(--spacer-base) 0;
    @include for-mobile {
      --property-name-font-size: var(--font-base);
      --property-value-font-size: var(--font-lg);
      --property-value-font-weight: var(--font-semibold);
      &__total {
        --property-value-font-weight: var(--font-bold);
      }
    }
    &:last-of-type {
      @include for-desktop {
        margin: var(--spacer-base) 0 var(--spacer-2xl) 0;
      }
    }
  }
  .divider {
    --divider-border-color: var(--c-white);
    --divider-margin: var(--spacer-lg) 0 0 0;
    @include for-desktop {
      --divider-margin: calc(var(--spacer-base) * 2) 0 0 0;
    }
  }
  .actions {
    &__email {
      margin: var(--spacer-lg) 0 0 0;
    }
    &__button {
      margin: var(--spacer-sm) 0;
      &--secondary {
        margin: 0 0 0 var(--spacer-xs);
        text-align: left;
      }
    }
  }
  .promo-code {
    padding: 0;
  }
  .sf-loader {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
  }
}
</style>
