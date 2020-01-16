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
            :regular-price="getProductRegularPrice(product)"
            :special-price="getProductSpecialPrice(product)"
            :stock="10"
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
              <div class="collected-product__actions">
                <div><AAddToWishlist :product="product" /></div>
                <div><AAddToCompare :product="product" /></div>
              </div>
            </template>
          </SfCollectedProduct>
        </transition-group>
      </div>
      <SfProperty class="sf-property--full-width o-microcart__total-price">
        <template #name>
          <span class="sf-property__name">{{ $t("TOTAL") }}</span>
        </template>
        <template #value>
          <SfPrice :regular="subtotal.value | price" class="sf-price--big" />
        </template>
      </SfProperty>
      <SfButton class="sf-button--full-width" @click.native="goToCheckout">
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
        class="sf-button--full-width color-secondary"
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
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';

import VueOfflineMixin from 'vue-offline/mixin';
import onEscapePress from '@vue-storefront/core/mixins/onEscapePress';

import AAddToCompare from 'theme/components/atoms/a-add-to-compare';
import AAddToWishlist from 'theme/components/atoms/a-add-to-wishlist';
import {
  SfButton,
  SfCollectedProduct,
  SfProperty,
  SfPrice
} from '@storefront-ui/vue';

export default {
  components: {
    AAddToCompare,
    AAddToWishlist,
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
    subtotal () {
      let subtotal = this.totals.filter(total => total.code === 'subtotal');
      return subtotal.length > 0 ? subtotal[0] : false;
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
      return getThumbnailForProduct(product);
    },
    getProductRegularPrice (product) {
      let price = product.original_price_incl_tax
        ? product.original_price_incl_tax
        : product.price_incl_tax;
      return price ? this.$options.filters.price(price) : '';
    },
    getProductSpecialPrice (product) {
      let price = product.special_price ? product.price_incl_tax : false;
      return price ? this.$options.filters.price(price) : '';
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
    font-family: $body-font-family-secondary;
    font-size: $font-size-big-mobile;
    font-weight: $body-font-weight-secondary;
    @include for-desktop {
      font-size: $font-size-big-desktop;
    }
  }
  &__total-price {
    margin-bottom: $spacer-big;
  }
}
.collected-product-list {
  flex: 1;
  margin: $spacer-big -#{$spacer-big};
}
.collected-product {
  margin: $spacer-big 0;
  &__properties {
    margin-top: $spacer-big;
  }
  &__actions {
    opacity: 0;
    transition: opacity 300ms ease-in-out;
    @at-root.collected-product:hover & {
      @include for-desktop {
        opacity: 1;
      }
    }
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
    margin-top: $spacer-extra-big;
    font-size: $font-size-big-desktop;
  }
  &__description {
    margin-top: $spacer-big;
  }
}
</style>
