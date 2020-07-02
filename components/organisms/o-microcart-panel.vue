<template>
  <SfSidebar
    :visible="isMicrocartOpen && isMicrocartVisible"
    class="sf-sidebar--right sf-sidebar--icon o-microcart-panel"
    @close="$store.commit('ui/setMicrocart')"
  >
    <template v-if="totalItems" #content-top>
      <SfProperty
        class="sf-property--large"
        :name="$t('Total items')"
        :value="productsCount"
      />
    </template>
    <transition name="fade" mode="out-in">
      <div v-if="totalItems" key="my-cart" class="my-cart">
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
                  <SfProperty :name="$t('SKU')" :value="product.sku" />
                  <SfProperty
                    v-for="property in getProductOptions(product)"
                    :key="property.label"
                    :name="property.label"
                  >
                    <template #value>
                      <span class="sf-property__value" v-html="property.value" />
                    </template>
                  </SfProperty>
                </div>
              </template>
              <template #more-actions>
                <span />
              </template>
            </SfCollectedProduct>
          </transition-group>
        </div>
      </div>
      <div v-else key="empty-cart" class="empty-cart">
        <div class="empty-cart__banner">
          <SfImage
            :src="require('@storefront-ui/shared/icons/empty_cart.svg')"
            :alt="$t('Your bag is empty')"
            class="empty-cart__image"
          />
          <SfHeading
            :title="$t('Your bag is empty')"
            :subtitle="$t('Looks like you haven’t added any items to the bag yet. Start shopping to fill it in.')"
            :level="2"
            class="empty-cart__heading"
          />
        </div>
      </div>
    </transition>
    <template #content-bottom>
      <transition name="fade">
        <div v-if="totalItems">
          <SfProperty
            class="sf-property--full-width my-cart__total-price"
            v-for="total in totals"
            :key="total.code"
          >
            <template #name>
              <span class="sf-property__name">{{ total.title }}</span>
            </template>
            <template #value>
              <SfPrice :regular="total.value | price" />
            </template>
          </SfProperty>
          <SfButton
            class="sf-button--full-width color-secondary"
            @click.native="goToCheckout"
          >
            {{ $t("Go to checkout") }}
          </SfButton>
        </div>
        <div v-else>
          <SfButton
            class="sf-button--full-width color-primary"
            @click.native="startShopping"
          >
            {{ $t("Start shopping") }}
          </SfButton>
        </div>
      </transition>
    </template>
  </SfSidebar>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
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
  SfPrice,
  SfImage,
  SfHeading,
  SfSidebar
} from '@storefront-ui/vue';

export default {
  components: {
    SfButton,
    SfCollectedProduct,
    SfProperty,
    SfPrice,
    SfImage,
    SfHeading,
    SfSidebar
  },
  mixins: [VueOfflineMixin, onEscapePress],
  data () {
    return {
      isMicrocartVisible: false
    };
  },
  computed: {
    ...mapState({
      isMicrocartOpen: state => state.ui.microcart
    }),
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      totals: 'cart/getTotals'
    }),
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
      this.$store.dispatch('ui/closeMicrocart')
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
    getProductPrice (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? getProductPriceFromTotals(product)
        : getProductPrice(product);
    },
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || {};
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
  },
  mounted () {
    this.isMicrocartVisible = true;
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
.o-microcart-panel {
  @include for-mobile {
    ::v-deep .sf-sidebar__aside {
      max-height: calc(100vh - var(--bottom-navigation-height));
    }
  }
  @include for-desktop {
    --sidebar-bottom-padding: var(--spacer-base);
    --sidebar-content-padding: var(--spacer-base);
  }
}
.my-cart {
  flex: 1;
  display: flex;
  flex-direction: column;
  &__total-items {
    margin: 0;
  }
  &__total-price {
    --price-font-size: var(--font-sm);
    --price-font-weight: var(--font-semibold);
    margin: 0 0 var(--spacer-xs) 0;
  }
}
.empty-cart {
  --heading-subtitle-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-margin: 0 0 var(--spacer-base) 0;
  --heading-title-color: var(--c-primary);
  --heading-title-font-weight: var(--font-semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__banner {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
  &__heading {
    padding: 0 var(--spacer-base);
  }
  &__image {
    --image-width: 13.1875rem;
    margin: 0 0 var(--spacer-2xl) 0;
  }
  @include for-desktop {
    --heading-title-font-size: var(--font-xl);
  }
}
.collected-product-list {
  flex: 1;
}
.collected-product {
  --collected-product-image-background: var(--c-white);
  margin: 0 0 var(--spacer-sm) 0;
  &__properties {
    margin: var(--spacer-xs) 0 0 0;
  }
  &__actions {
    transition: opacity 150ms ease-in-out;
    opacity: var(--cp-actions-opacity, 0);
  }
  &__action {
    --button-padding: 0;
  }
  &:hover {
    --cp-actions-opacity: 1;
  }
}
</style>
