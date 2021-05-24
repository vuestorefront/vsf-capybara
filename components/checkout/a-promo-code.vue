<template>
  <div class="a-promo-code promo-code">
    <template v-if="!isCouponCode">
      <SfInput
        v-model="promoCode"
        name="promoCode"
        :placeholder="$t('Add a discount code')"
        class="sf-input--filled promo-code__input"
        @keyup.enter="applyCoupon"
      />
      <SfCircleIcon
        class="promo-code__circle-icon"
        icon="check"
        @click="applyCoupon"
      />
    </template>
    <SfButton
      v-else-if="allowPromoCodeRemoval"
      class="sf-button sf-button--outline promo-code__button"
      @click="removeCoupon"
    >
      {{ $t("Delete discount code") }}
    </SfButton>
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
      promoCode: ''
    };
  },
  computed: {
    isCouponCode () {
      return this.$store.state.cart.platformTotals ? this.$store.state.cart.platformTotals.coupon_code : false;
    }
  },
  methods: {
    async applyCoupon () {
      await this.$store.dispatch('cart/applyCoupon', this.promoCode);
      this.promoCode = ''
    },
    removeCoupon () {
      this.$store.dispatch('cart/removeCoupon');
    }
  }
};
</script>
<style lang="scss" scoped>
.promo-code {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: var(--spacer-lg) 0 0;
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
}
</style>
