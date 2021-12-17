<template>
  <div class="m-product-add-to-cart">
    <SfAlert
      v-if="alert"
      class="alert"
      :message="alert.message"
      :type="alert.type"
    />
    <SfAddToCart v-model="qty">
      <template #add-to-cart-btn>
        <AAddToCart
          class="sf-add-to-cart__button"
          :qty="qty"
          :product="product"
          :disabled="isAddToCartDisabled"
        />
      </template>
      <template #quantity-select-input>
        <AProductQuantity
          class="sf-add-to-cart__select-quantity"
          v-if="product.type_id !== 'grouped' && product.type_id !== 'bundle'"
          v-model="qty"
          :max-quantity="stock.max"
          :loading="stock.isLoading"
          :unlimit-quantity="!isSimpleOrConfigurable"
          @input="$emit('input', $event)"
          @error="handleQuantityValidationError"
        />
        <span v-else>&nbsp;</span>
      </template>
    </SfAddToCart>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { SfAddToCart, SfAlert } from '@storefront-ui/vue';
import AProductQuantity from 'theme/components/atoms/a-product-quantity.vue';
import AAddToCart from 'theme/components/atoms/a-add-to-cart.vue';
import Product from 'core/modules/catalog/types/Product';

export default Vue.extend({
  name: 'MProductAddToCart',
  components: {
    SfAddToCart,
    SfAlert,
    AProductQuantity,
    AAddToCart
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
      return !!this.qtyValidationError || this.stock.isLoading || !this.isAvailable
    },
    isAvailable () {
      return !this.isOnline || !!this.stock.max || !this.stock.manageQuantity || !this.isSimpleOrConfigurable
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
      if (!this.isAvailable) {
        return {
          type: 'danger',
          message: this.$t('Selected variant is out of stock')
        }
      }
      return false
    }
  },
  methods: {
    handleQuantityValidationError (error) {
      this.qtyValidationError = error
    }
  },
  watch: {
    product: {
      handler (newProduct: Product, oldProduct: Product) {
        if (newProduct.parentSku === oldProduct.parentSku) {
          return;
        }

        this.qty = (newProduct.stock.min_qty !== 0) ? newProduct.stock.min_qty : 1
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.alert {
  margin-bottom: var(--spacer-base)
}
</style>
