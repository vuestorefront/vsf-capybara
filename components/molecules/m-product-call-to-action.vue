<template>
  <div class="m-product-call-to-action">
    <SfAddToCart
      v-model="qty"
      :stock="stock"
      :can-add-to-cart="stock > 0"
      class="m-product-call-to-action__add-to-cart"
    />
    <ATextAction
      class="m-product-call-to-action__text-action"
      text="Save for later"
    />
    <ATextAction
      class="m-product-call-to-action__text-action"
      text="Add to compare"
    />
  </div>
</template>
<script>
import { SfAddToCart } from '@storefront-ui/vue';
import ATextAction from 'theme/components/atoms/a-text-action';
export default {
  name: 'MProductCallToAction',
  components: {
    SfAddToCart,
    ATextAction
  },
  data () {
    return {
      qty: '1',
      stock: 5
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.m-product-call-to-action {
  &__add-to-cart {
    margin-top: 1.5rem;
    @include for-desktop {
      margin-top: $spacer-extra-big;
    }
  }
  &__text-action {
    @include for-desktop {
      justify-content: flex-end;
    }
  }
}
</style>
