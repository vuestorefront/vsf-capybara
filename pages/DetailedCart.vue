<template>
  <div id="detailed-cart">
    <div class="detailed-cart">
      <div v-if="totalItems" class="detailed-cart__aside">
        <OrderSummary
          :products="products"
          :shipping-methods="shippingMethods"
          :total-items="totalItems"
        />
      </div>
      <div class="detailed-cart__main">
        <SfBreadcrumbs
          class="breadcrumbs desktop-only"
          :breadcrumbs="breadcrumbs"
        />
        <transition name="fade" mode="out-in">
          <div
            v-if="totalItems"
            key="detailed-cart"
            class="collected-product-list"
          >
            <transition-group name="fade" tag="div">
              <SfCollectedProduct
                v-for="product in products"
                :key="product.id"
                :qty="product.qty"
                :image="getThumbnailForProductExtend(product)"
                :title="product.name"
                :regular-price="
                  product.price.regular && `$${product.price.regular}`
                "
                :special-price="
                  product.price.special && `$${product.price.special}`
                "
                class="sf-collected-product--detailed collected-product"
                @click:remove="removeHandler(product)"
                @input="changeQuantity(product, $event)"
              >
                <template #configuration>
                  <div class="collected-product__properties">
                    <SfProperty
                      v-for="(property, key) in product.configuration"
                      :key="key"
                      :name="property.name"
                      :value="property.value"
                    />
                  </div>
                </template>
                <template #actions>
                  <SfButton class="sf-button--text actions__button desktop-only">
                    Edit
                  </SfButton>
                  <SfButton class="sf-button--text actions__button desktop-only">
                    Save for later
                  </SfButton>
                  <SfButton class="sf-button--text actions__button desktop-only">
                    Add to compare
                  </SfButton>
                  <SfButton class="sf-button--text actions__button desktop-only">
                    Add message or gift wrap
                  </SfButton>
                </template>
              </SfCollectedProduct>
            </transition-group>
          </div>
          <div v-else key="empty-cart" class="empty-cart">
            <SfImage
              :src="require('@storefront-ui/shared/icons/empty_cart.svg')"
              alt="Empty cart"
              class="empty-cart__image"
            />
            <SfHeading
              title="Your cart is empty"
              :level="2"
              subtitle="Looks like you haven’t added any items to the cart yet. Start
                shopping to fill it in."
            />
            <SfButton
              class="sf-button--full-width color-primary empty-cart__button"
            >
              Start shopping
            </SfButton>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SfCollectedProduct,
  SfButton,
  SfImage,
  SfProperty,
  SfHeading,
  SfBreadcrumbs
} from '@storefront-ui/vue';
import { OrderSummary } from './DetailedCart/index.js';
import { mapGetters } from 'vuex';
import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
export default {
  name: 'DetailedCart',
  components: {
    SfCollectedProduct,
    SfBreadcrumbs,
    SfImage,
    SfButton,
    SfHeading,
    SfProperty,
    OrderSummary
  },
  mixins: [Shipping],
  data () {
    return {
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Cart',
          link: '/cart'
        }
      ]
    };
  },
  props: {
    isActive: {
      type: Boolean,
      default: true
    }
  },
  created () {
    console.log(this.products)
  },
  computed: {
    ...mapGetters({
      products: 'cart/getCartItems'
    }),
    totalItems () {
      return this.products.reduce(
        (totalItems, product) => totalItems + parseInt(product.qty, 10),
        0
      );
    }
  },
  methods: {
    removeHandler (product) {
      this.$store.dispatch('cart/removeItem', { product: product });
    },
    getThumbnailForProductExtend (product) {
      return getThumbnailForProduct(product);
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
#detailed-cart {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
    padding: 0 var(--spacer-sm);
  }
}
.breadcrumbs {
  padding: var(--spacer-base) 0;
}
.detailed-cart {
  &__main {
    padding: 0 var(--spacer-sm);
    @include for-desktop {
      padding: 0;
    }
  }
  &__aside {
    box-sizing: border-box;
    width: 100%;
    background: var(--c-light);
    padding: var(--spacer-xl);
  }
  @include for-desktop {
    display: flex;
    &__main {
      flex: 1;
    }
    &__aside {
      flex: 0 0 26.8125rem;
      order: 1;
      margin: 0 0 0 var(--spacer-xl);
      box-shadow: 0px 4px 11px rgba(var(--c-dark-base), 0.1);
    }
  }
}
.collected-product {
  --collected-product-padding: var(--spacer-sm) 0;
  border: 1px solid var(--c-light);
  border-width: 1px 0 0 0;
  &__properties {
    margin: var(--spacer-sm) 0 0 0;
  }
  @include for-mobile {
    --collected-product-remove-bottom: var(--spacer-sm);
    &:first-of-type {
      border: none;
    }
  }
  @include for-desktop {
    --collected-product-padding: var(--spacer-lg) 0;
  }
}
.actions {
  &__button {
    margin: 0 0 var(--spacer-base) 0;
  }
}
.empty-cart {
  --heading-title-color: var(--c-primary);
  --heading-title-margin: 0 0 var(--spacer-base) 0;
  --heading-subtitle-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-font-weight: var(--font-semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  &__image {
    --image-width: 13.1875rem;
    margin: var(--spacer-2xl) 0;
  }
  @include for-desktop {
    &__image {
      --image-width: 22rem;
    }
    &__button {
      --button-width: 20.9375rem;
    }
  }
}
</style>
