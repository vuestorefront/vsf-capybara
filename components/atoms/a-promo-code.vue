<template>
  <div class="a-promo-code">
    <SfButton
      v-if="!isCouponCode"
      class="promo-code__button"
      @click="showPromoCode = !showPromoCode"
    >
      {{ showPromoCode ? "-" : "+" }} {{ $t("Discount code") }}
    </SfButton>
    <SfButton
      v-else
      class="promo-code__button"
      @click="removeCoupon"
    >
      {{ $t("Delete discount code") }}
    </SfButton>
    <transition name="fade">
      <div v-if="showPromoCode">
        <SfInput
          v-model="promoCode"
          name="promoCode"
          :label="$t('Add a discount code')"
          class="promo-code__input"
          @keyup.enter="applyCoupon"
        />
        <SfButton class="sf-button--full-width" @click="applyCoupon">
          {{ $t("Add discount code") }}
        </SfButton>
      </div>
    </transition>
  </div>
</template>

<script>
import { SfInput, SfButton } from '@storefront-ui/vue';

export default {
  name: 'APromoCode',
  components: {
    SfInput,
    SfButton
  },
  data () {
    return {
      promoCode: '',
      showPromoCode: false
    };
  },
  computed: {
    isCouponCode () {
      return this.$store.state.cart.platformTotals.coupon_code
    }
  },
  methods: {
    async applyCoupon () {
      await this.$store.dispatch('cart/applyCoupon', this.promoCode);
      this.promoCode = ''
      this.showPromoCode = false
    },
    removeCoupon () {
      this.$store.dispatch('cart/removeCoupon');
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.promo-code {
  &__button {
    padding: 0;
    background-color: transparent;
    color: $c-primary;
    font-size: $font-size-big-desktop;
  }
  &__input {
    margin: $spacer-big 0;
    ::v-deep input {
      border-color: $c-gray-variant;
    }
  }
}
</style>
