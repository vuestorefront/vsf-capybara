<template>
  <div class="m-product-call-to-action">
    <div class="m-product-call-to-action__add-to-cart">
      <SfAlert
        v-if="alert.message"
        class="m-product-call-to-action__alert"
        :message="alert.message"
        :type="alert.type"
      />
      <div class="m-product-call-to-action__add-to-cart-action">
        <AProductQuantity
          v-if="product.type_id !== 'grouped' && product.type_id !== 'bundle'"
          v-model="qty"
          :max-quantity="stock.max"
          :loading="stock.isLoading"
          :unlimit-quantity="!isSimpleOrConfigurable"
          @error="handleQuantityValidationError"
        />
        <AAddToCart
          :product="product"
          :disabled="isAddToCartDisabled"
        />
      </div>
    </div>
    <AAddToWishlist
      class="m-product-call-to-action__text-action"
      :product="product"
    />
    <AAddToCompare
      class="m-product-call-to-action__text-action"
      :product="product"
    />
  </div>
</template>
<script>
import { onlineHelper } from '@vue-storefront/core/helpers';
import { SfAlert } from '@storefront-ui/vue';
import AProductQuantity from 'theme/components/atoms/a-product-quantity';
import AAddToCart from 'theme/components/atoms/a-add-to-cart';
import AAddToWishlist from 'theme/components/atoms/a-add-to-wishlist';
import AAddToCompare from 'theme/components/atoms/a-add-to-compare';
export default {
  name: 'MProductCallToAction',
  components: {
    SfAlert,
    AProductQuantity,
    AAddToCart,
    AAddToWishlist,
    AAddToCompare
  },
  data () {
    return {
      qty: 1,
      qtyValidationError: ''
    };
  },
  props: {
    product: {
      type: Object,
      required: true,
      default: () => ({})
    },
    stock: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    isOnline () {
      return onlineHelper.isOnline;
    },
    isAddToCartDisabled () {
      return this.qtyValidationError ||
        this.stock.isLoading ||
        (this.isOnline && !this.stock.max && this.isSimpleOrConfigurable)
    },
    isSimpleOrConfigurable () {
      return ['simple', 'configurable'].includes(
        this.product.type_id
      );
    },
    alert () {
      if (this.qtyValidationError) {
        return {
          type: 'danger',
          message: this.qtyValidationError
        }
      }
      return {
        type: this.stock.max ? 'info' : 'warning',
        message: this.quantityInfo
      }
    },
    quantityInfo () {
      if (this.isSimpleOrConfigurable) {
        return this.$i18n.t(
          this.isOnline ? 'Quantity available' : 'Quantity available offline',
          { qty: this.stock.max }
        );
      }
      return ''
    }
  },
  methods: {
    handleQuantityValidationError (error) {
      this.qtyValidationError = error
    }
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
  display: flex;
  flex-direction: column;
  &__add-to-cart {
    margin-top: 1.5rem;
    @include for-desktop {
      margin-top: $spacer-extra-big;
    }
  }
  &__add-to-cart-action {
    display: flex;
    flex-direction: row-reverse;
    @include for-desktop {
      flex-direction: row;
    }
    ::v-deep .a-product-quantity {
      margin: 0 0 0 .5rem;
      @include for-desktop {
        margin-left: 0;
      }
    }
  }
  &__text-action {
    margin: 1.25rem auto .625rem 0;
    font-size: $font-size-regular-mobile;
    @include for-desktop {
      margin: 1.25rem 0 .625rem auto;
      font-size: $font-size-regular-desktop;
    }
  }
  &__alert {
    margin-bottom: 1rem;
  }
}
</style>
