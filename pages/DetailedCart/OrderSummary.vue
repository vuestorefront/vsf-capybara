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
        :value="`$${subtotal}`"
        class="sf-property--full-width sf-property--large property"
      />
      <SfProperty
        name="Discount"
        v-if="discount > 0"
        :value="`$${discount}`"
        class="sf-property--full-width sf-property--large property"
      />
      <SfDivider class="divider" />
      <SfProperty
        name="Total price"
        :value="`$${total}`"
        class="sf-property--full-width sf-property--large property property__total"
      />
      <div class="_total-notes">
        All pricing in USD
      </div>
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
    <SfLoader v-if="isUpdatingQuantity" :loading="isUpdatingQuantity" />
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
import { getProductPrice } from 'theme/helpers';
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
    subtotal () {
      const products = this.products;
      const subtotal = products.reduce((accumulator, current) => {
        const productPrice = this.getProductPrice(current);
        const price = productPrice.regular;
        const priceValue = parseFloat(price.replace('$', ''));
        return accumulator + priceValue;
      }, 0);
      return subtotal.toFixed(2);
    },
    discount () {
      const products = this.products;
      const discount = products.reduce((accumulator, current) => {
        const productPrice = this.getProductPrice(current);
        const regularPrice = productPrice.regular;
        const specialPrice = productPrice.special ? productPrice.special : productPrice.regular;
        const regularPriceValue = parseFloat(regularPrice.replace('$', ''));
        const specialPriceValue = parseFloat(specialPrice.replace('$', ''));
        return accumulator + (regularPriceValue - specialPriceValue);
      }, 0);
      return discount.toFixed(2);
    },
    total () {
      const total = this.subtotal - this.discount;
      return total.toFixed(2);
    }
  },
  methods: {
    getProductPrice (product) {
      return getProductPrice(product);
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
  ._total-notes{
    text-align: right;
    font-size: var(--font-sm);

    @include for-desktop {
      font-size: var(--font-base);
    }
  }
  .actions {
    margin-top: var(--spacer-lg);
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
