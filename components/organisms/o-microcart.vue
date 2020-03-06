<template>
  <transition name="fade" mode="out-in">
    <div v-if="totalItems" key="my-cart" class="o-microcart">
      <h3 class="o-microcart__total-items">
        {{ $t("Total items") }}: {{ productsCount }}
      </h3>
      <div class="collected-product-list">
        <transition-group name="fade" tag="div">
          <SfCollectedProduct
            v-for="product in productsInCart"
            :key="product.id"
            :image="getThumbnailForProductExtend(product)"
            :title="product.name"
            :regular-price="getProductPrice(product).regular"
            :special-price="getProductPrice(product).special"
            :stock="10"
            :qty="product.qty"
            class="collected-product"
            @click:remove="removeHandler(product)"
            @input="changeQuantity(product, $event)"
          >
            <template #configuration>
              <div class="collected-product__properties">
                <SfProperty
                  v-for="(property, key) in product.options"
                  :key="key"
                  :name="property.label"
                  :value="property.value"
                />
              </div>
            </template>
            <template #actions>
              <div class="hidden" />
            </template>
          </SfCollectedProduct>
        </transition-group>
      </div>
      <SfProperty class="sf-property--full-width o-microcart__total-price">
        <template #name>
          <span class="sf-property__name">{{ $t("TOTAL") }}</span>
        </template>
        <template #value>
          <SfPrice :regular="total | price" class="sf-price--big" />
        </template>
      </SfProperty>
      <SfButton class="sf-button--full-width cart-action" @click.native="goToCheckout">
        {{ $t("Go to checkout") }}
      </SfButton>
    </div>
    <div v-else key="empty-cart" class="empty-cart">
      <div class="empty-cart__banner">
        <img
          src="@storefront-ui/shared/icons/empty_cart.svg"
          alt=""
          class="empty-cart__icon"
        >
        <h3 class="empty-cart__label">
          {{ $t("Your bag is empty") }}
        </h3>
        <p class="empty-cart__description">
          {{
            $t(
              "Looks like you haven’t added any items to the bag yet. Start shopping to fill it in."
            )
          }}
        </p>
      </div>
      <SfButton
        class="sf-button--full-width color-secondary cart-action"
        @click.native="startShopping"
      >
        {{ $t("Start shopping") }}
      </SfButton>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from 'vuex';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { getProductPrice, getProductPriceFromTotals } from 'theme/helpers';
import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';

import {
  SfButton,
  SfCollectedProduct,
  SfProperty,
  SfPrice
} from '@storefront-ui/vue';

export default {
  components: {
    SfButton,
    SfCollectedProduct,
    SfProperty,
    SfPrice
  },
  mixins: [VueOfflineMixin, onEscapePress],
  computed: {
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals'
    }),
    total () {
      return this.totals.reduce(
        (result, total) => total.code === 'subtotal' || total.code === 'tax'
          ? result + total.value
          : result,
        0
      );
    },
    totalItems () {
      return this.productsInCart.length;
    },
    productsCount () {
      let count = 0;
      this.productsInCart.forEach(product => {
        count = count + parseInt(product.qty);
      });
      return count;
    }
  },
  methods: {
    closeMicrocartExtend () {
      this.$store.dispatch('ui/toggleMicrocart');
    },
    onEscapePress () {
      this.closeMicrocartExtend();
    },
    startShopping () {
      this.$router.push(localizedRoute('/'));
      this.closeMicrocartExtend();
    },
    getThumbnailForProductExtend (product) {
      return product.name === 'Inez Full Zip Jacket' ? 'https://shopware-2.vuestorefront.io/media/1c/3e/cb/1575554539/fashion_ZA029207_006_p2_5.jpg.jpg' : getThumbnailForProduct(product);
    },
    getProductPrice (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? getProductPriceFromTotals(product)
        : getProductPrice(product);
    },
    removeHandler (product) {
      this.$store.dispatch('cart/removeItem', { product: product });
    },
    goToCheckout () {
      this.$router.push(localizedRoute('/checkout'));
      this.closeMicrocartExtend();
    },
    changeQuantity (product, newQuantity) {
      this.$store.dispatch('cart/updateQuantity', {
        product: product,
        qty: newQuantity
      });
    },
    onQuantityChange () {
      // Unfortunately $forceUpdate() is needed here because `totals` key in cart items
      // is added but not in a reactive way, so Vue is not able to detect this change and
      // re-render our view.
      // The callback for 'cart-after-itemchanged' event can be removed when the following PR
      // will be merged in VSF: https://github.com/DivanteLtd/vue-storefront/pull/4079/
      this.$forceUpdate();
    }
  },
  beforeMount () {
    this.$bus.$on('cart-after-itemchanged', this.onQuantityChange);
  },
  beforeDestroy () {
    this.$bus.$off('cart-after-itemchanged', this.onQuantityChange);
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#cart {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
.o-microcart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    font-family: var(--body-font-family-secondary);
    font-size: var(--font-size-big);
    font-weight: var(--body-font-weight-secondary);
  }
  &__total-price {
    margin-bottom: var(--spacer-big);
  }
}
.collected-product-list {
  flex: 1;
  margin: var(--spacer-big) var(--spacer-big);
}
.collected-product {
  margin: var(--spacer-big) 0;
  &__properties {
    margin-top: var(--spacer-big);
  }
}
.empty-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__banner {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  &__icon {
    width: 18.125rem;
    height: 12.3125rem;
    margin-left: 60%;
    @include for-desktop {
      margin-left: 50%;
    }
  }
  &__label,
  &__description {
    line-height: 1.6;
    text-align: center;
  }
  &__label {
    margin-top: var(--spacer-extra-big);
    font-size: var(--font-size-big);
  }
  &__description {
    margin-top: var(--spacer-big);
  }
}
@include for-mobile {
  .cart-action {
    margin-bottom: var(--spacer-big);
  }
}
</style>
