<template>
  <div class="a-promo-code">
    <div class="a-promo-code__title">
      <slot name="title" />
    </div>

    <div v-if="!isCouponCode" class="a-promo-code__form">
      <SfInput
        v-model="promoCode"
        name="promoCode"
        :placeholder="$t('Add a discount code')"
        class="sf-input--filled a-promo-code__input"
        @keyup.enter="applyCoupon"
      />
      <SfCircleIcon
        class="a-promo-code__circle-icon"
        icon="check"
        @click="applyCoupon"
      />
    </div>
    <SfButton
      v-else-if="allowPromoCodeRemoval"
      class="sf-button sf-button--outline a-promo-code__button"
      @click="removeCoupon"
    >
      {{ $t('Delete discount code') }}
    </SfButton>
    <div class="a-promo-code__message" v-if="message">
      {{ message }}
    </div>
  </div>
</template>

<script>
import { SfInput, SfButton, SfCircleIcon } from '@storefront-ui/vue';

export default {
  name: 'APromoCode',
  components: {
    SfInput,
    SfButton,
    SfCircleIcon
  },
  props: {
    allowPromoCodeRemoval: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      promoCode: '',
      fMessage: ''
    };
  },
  computed: {
    isCouponCode () {
      return this.$store.state.cart.platformTotals ? this.$store.state.cart.platformTotals.coupon_code : false;
    },
    message: {
      set: function (message) {
        this.fMessage = message;

        setTimeout(() => { this.fMessage = '' }, 5000);
      },
      get: function () {
        return this.fMessage;
      }
    }
  },
  methods: {
    applyCoupon () {
      this.$store.dispatch('cart/applyCoupon', this.promoCode)
        .then((result) => {
          if (!result) this.message = `Coupon code "${this.promoCode}" is not valid.`;
        }).finally(() => {
          this.promoCode = '';
        });
    },
    removeCoupon () {
      this.$store.dispatch('cart/removeCoupon');
    }
  }
};
</script>
<style lang="scss" scoped>
.a-promo-code {
  display: flex;
  flex-direction: column;

  &__form {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-top: var(--spacer-sm);
  }
  &__circle-icon {
    --button-size: 2rem;
    --icon-size: 0.6875rem;
  }
  &__input {
    --input-background: var(--c-white);
    flex: 1;
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__button {
    --button-height: 2rem;
    --button-font-size: 0.6875rem;
  }
  &__message {
    margin-top: var(--spacer-xs);
    font-size: var(--font-xs);
    color: var(--c-danger-variant);
  }
  ::v-deep .sf-input {
    &__wrapper {
      --input-margin: 0;
    }
    &__error-message {
      height: auto;
    }
  }
}
</style>
