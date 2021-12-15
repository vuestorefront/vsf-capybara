<template>
  <div
    class="m-cta-button"
    :class="{ '-small': size === 'small' }"
    v-show="showCtaButtonContainer"
  >
    <MMakeYourOwnDropdown v-show="showMakeYourOwnDropdown" :size="size" />

    <SfButton v-show="showGoToCheckoutButton" @click="goToCheckout">
      Go to Checkout
    </SfButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SfButton } from '@storefront-ui/vue';

import Product from 'core/modules/catalog/types/Product';

import MMakeYourOwnDropdown from 'theme/components/molecules/m-make-your-own-dropdown.vue';

enum HeaderCtaButtonType {
  DEFAULT = 'default',
  GO_TO_CHECKOUT = 'go-to-checkout',
  HIDDEN = 'hidden',
}

export default Vue.extend({
  props: {
    size: {
      type: String,
      default: ''
    }
  },
  components: {
    MMakeYourOwnDropdown,
    SfButton
  },
  computed: {
    cartItems (): Product[] {
      return this.$store.getters['cart/getCartItems'];
    },
    ctaButtonType () {
      const routeName = this.$route.name;
      if (
        routeName === 'detailed-cart' &&
        this.cartItems &&
        this.cartItems.length > 0
      ) {
        return HeaderCtaButtonType.GO_TO_CHECKOUT;
      }

      if (routeName === 'checkout') {
        return HeaderCtaButtonType.HIDDEN;
      }

      return HeaderCtaButtonType.DEFAULT;
    },
    showCtaButtonContainer (): boolean {
      return this.ctaButtonType !== HeaderCtaButtonType.HIDDEN;
    },
    showGoToCheckoutButton (): boolean {
      return this.ctaButtonType === HeaderCtaButtonType.GO_TO_CHECKOUT;
    },
    showMakeYourOwnDropdown (): boolean {
      return this.ctaButtonType === HeaderCtaButtonType.DEFAULT;
    }
  },
  methods: {
    goToCheckout (): void {
      this.$router.push({ name: 'checkout' });
    }
  }
});
</script>

<style lang="scss" scoped>
.m-cta-button {
  .sf-button {
    --button-font-size: var(--font-sm);
    --button-font-line-height: 1;
  }

  &.-small {
    .sf-button {
      --button-font-size: var(--font-2xs);
      --button-font-line-height: 1;
      --button-padding: calc(var(--spacer-2xs) * 3) var(--spacer-sm);
    }
  }
}
</style>
