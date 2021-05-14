<template>
  <div>
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
        :value="`From ${cheapestShippingMethod.price}`"
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
      <SfButton
        class="sf-button--full-width actions__button desktop-only"
        @click="goToCheckout"
      >
        Go to checkout
      </SfButton>
      <div class="actions__email">
        <SfCharacteristic icon="mail" size-icon="20px" color-icon="secondary">
          <template #text>
            <SfButton
              class="sf-button--text actions__button actions__button--secondary"
            >
              Send my basket to email
            </SfButton>
          </template>
        </SfCharacteristic>
      </div>
    </div>
    <div class="info desktop-only">
      <p>Helpful information:</p>
      <ul class="info__list">
        <li>Questions? Chat with us or call 1.888.282.6060.</li>
        <li>Shipping internationally? Choose your destination & currency.</li>
        <li>Shipping methods & charges</li>
      </ul>
    </div>
  </div>
</template>
<script>
import {
  SfHeading,
  SfButton,
  SfCharacteristic,
  SfProperty,
  SfDivider
} from '@storefront-ui/vue';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getProductPrice, getProductPriceFromTotals } from 'theme/helpers';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
export default {
  name: 'OrderSummary',
  components: {
    SfHeading,
    SfButton,
    SfDivider,
    SfCharacteristic,
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
.info {
  margin: var(--spacer-2xl) 0;
  color: var(--c-dark-variant);
  font-family: var(--font-family-primary);
  font-size: var(--font-xs);
  line-height: 1.6;
  &__list {
    padding: 0;
    list-style: none;
    li::before {
      content: "•";
      color: var(--c-primary);
      padding: 0 var(--spacer-xs) 0 0;
    }
  }
}
</style>
