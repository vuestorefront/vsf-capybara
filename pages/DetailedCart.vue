<template>
  <div id="detailed-cart" :class="{ '-loading': isLoading }">
    <div class="loader-container" v-if="isLoading">
      <div class="loader" />
    </div>
    <div class="detailed-cart" v-else>
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
                :key="product.id + product.checksum"
                :qty="product.qty"
                :image="getThumbnailForProductExtend(product)"
                image-width="140"
                image-height="140"
                :title="product.name"
                :link="getProductLink(product)"
                class="sf-collected-product--detailed collected-product"
                @input="changeQuantity(product, $event)"
              >
                <template #configuration>
                  <div class="collected-product__properties">
                    <div
                      v-for="option in getBundleProductOptions(product)"
                      :key="option"
                    >
                      <SfIcon
                        icon="check"
                        size="xxs"
                        color="blue-primary"
                        class="collected-product__properties__icon"
                      />
                      {{ option }}
                    </div>
                    <template v-for="option in getProductOptions(product)">
                      <SfProperty
                        v-if="isCustomOption(product, option)"
                        :key="option.label"
                        :name="option.label"
                        :value="option.value"
                      />
                      <div
                        v-else
                        :key="option.label"
                      >
                        {{ option.value }}
                      </div>
                    </template>
                  </div>
                </template>
                <template #price>
                  <div />
                </template>
                <template #actions>
                  <SfButton class="sf-button--text actions__button" @click="editHandler(product)">
                    Edit
                  </SfButton>
                  <SfButton
                    class="sf-button--text sf-collected-product__remove sf-collected-product__remove--text actions__button"
                    @click="removeHandler(product)"
                  >
                    Remove
                  </SfButton>
                </template>
                <template #remove>
                  <SfPrice
                    v-if="getProductRegularPrice(product)"
                    :regular="getProductRegularPrice(product)"
                    :special="getProductSpecialPrice(product)"
                  />
                </template>
                <template #more-actions>
                  <div />
                </template>
              </SfCollectedProduct>
            </transition-group>
            <div class="_dropdown-container">
              <SfButton
                class="color-secondary"
                @click.prevent.self="isDropdownOpen = !isDropdownOpen"
              >
                Order More
              </SfButton>
              <SfDropdown
                :is-open="isDropdownOpen"
                @click:close="isDropdownOpen = false"
              >
                <SfList>
                  <SfListItem
                    v-for="action in dropdownActions"
                    :key="action.label"
                  >
                    <router-link
                      :to="action.url"
                    >
                      {{ action.label }}
                    </router-link>
                  </SfListItem>
                </SfList>
              </SfDropdown>
            </div>
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
      <div v-if="totalItems" class="detailed-cart__aside">
        <OrderSummary
          :is-updating-quantity="isUpdatingQuantity"
        />

        <div class="_shipping-handling-block">
          <SfHeading :level="3" title="Shipping &amp; Handling" />
          <p>Once completed, your order will ship via USPS</p>
          <ul>
            <li>Petsies: (<strong>US</strong>) $13.95, $5.95 for each additional; (<strong>International</strong>) $25.95, $5.95 for each additional</li>
            <li>Pillows: <strong>(US</strong>) starting at $9.95;&nbsp;(<strong>International)</strong> $20.95</li>
            <li>Petsies Socks, Masks &amp; Keychains: (<strong>US</strong>) $4.95; (<strong>International</strong>)&nbsp;$9.95</li>
            <li>Read more about rates&nbsp;<a href="http://support.mypetsies.com/support/solutions/articles/13000017023-shipping-handling-fees" target="_blank">here</a>. Rates determined by weight</li>
            <li>Tracking number will be emailed to you at time of shipment</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  SfPrice,
  SfList,
  SfDropdown,
  SfCollectedProduct,
  SfButton,
  SfImage,
  SfProperty,
  SfHeading,
  SfBreadcrumbs,
  SfIcon
} from '@storefront-ui/vue';
import { OrderSummary } from './DetailedCart/index.js';
import { mapGetters, mapState } from 'vuex';
import { getProductPrice } from 'theme/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { ProductId } from 'src/modules/budsies';

export default {
  name: 'DetailedCart',
  components: {
    SfPrice,
    SfList,
    SfDropdown,
    SfCollectedProduct,
    SfBreadcrumbs,
    SfImage,
    SfButton,
    SfHeading,
    SfProperty,
    SfIcon,
    OrderSummary
  },
  data () {
    return {
      isUpdatingQuantity: false,
      isDropdownOpen: false,
      dropdownActions: [
        {
          label: 'Petsies',
          url: '/forevers-pet-plush'
        },
        {
          label: 'Pet Pillow',
          url: '/pet-pillow'
        },
        {
          label: 'Photo Pillow',
          url: {
            name: 'category',
            params: {
              slug: 'custom-photo-pillows-80'
            }
          }
        },
        {
          label: 'Socks',
          url: {
            name: 'printed-product',
            params: {
              parentSku: 'customPrintedSocks_bundle',
              slug: 'printed-socks'
            }
          }
        },
        {
          label: 'Face Masks',
          url: {
            name: 'printed-product',
            params: {
              parentSku: 'customPrintedMasks_bundle',
              slug: 'printed-masks'
            }
          }
        },
        {
          label: 'Pet Keychains',
          url: {
            name: 'printed-product',
            params: {
              parentSku: 'customPrintedKeychains_bundle',
              slug: 'face-keychains'
            }
          }
        }
      ],
      breadcrumbs: [
        {
          text: 'Home',
          link: '/'
        },
        {
          text: 'Cart',
          link: '/cart'
        }
      ],
      isMounted: false
    };
  },
  props: {
    isActive: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    ...mapState({
      cartIsLoaded: (state) => state.cart.cartIsLoaded
    }),
    ...mapGetters({
      products: 'cart/getCartItems'
    }),
    totalItems () {
      return this.products.reduce(
        (totalItems, product) => totalItems + parseInt(product.qty, 10),
        0
      );
    },
    isLoading () {
      return !this.isMounted || !this.cartIsLoaded;
    }
  },
  async mounted () {
    await this.$nextTick();
    this.isMounted = true;
  },
  methods: {
    editHandler (product) {
      this.$router.push({ name: 'forevers-create', query: { id: product.plushieId } })
    },
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || [];
    },
    isCustomOption (product, productOption) {
      if (!product.custom_options) {
        return false;
      }

      return product.custom_options.find(option => option.title === productOption.label) !== undefined;
    },
    getProductLink (product) {
      return formatProductLink(product);
    },
    getProductRegularPrice (product) {
      return getProductPrice(product, {}).regular;
    },
    getProductSpecialPrice (product) {
      return getProductPrice(product, {}).special;
    },
    removeHandler (product) {
      this.$store.dispatch('cart/removeItem', { product: product });
    },
    getThumbnailForProductExtend (product) {
      if (product.thumbnail && product.thumbnail.includes('://')) {
        return product.thumbnail;
      }

      return getThumbnailForProduct(product);
    },
    getBundleProductOptions (product) {
      if (!product.bundle_options ||
          product.bundle_options.length < 2 ||
          !product.product_option ||
          !product.product_option.extension_attributes ||
          !product.product_option.extension_attributes.bundle_options
      ) {
        return [];
      }

      let result = [];
      const productBundleOptions = product.product_option.extension_attributes.bundle_options;

      product.bundle_options.forEach(option => {
        // Hide Forevers simple products
        if ([ProductId.FOREVERS_DOG, ProductId.FOREVERS_CAT, ProductId.FOREVERS_OTHER]
          .includes(product.id) && option.title.toLowerCase() === 'product'
        ) {
          return;
        }

        if (!productBundleOptions.hasOwnProperty(option.option_id)) {
          return
        }

        const selections = productBundleOptions[option.option_id].option_selections;

        if (!selections) {
          return
        }

        selections.forEach(selection => {
          const productLink = option.product_links.find(productLink => +productLink.id === selection);

          if (!productLink) {
            return;
          }

          result.push(productLink.product.name);
        });
      });

      return result;
    },
    changeQuantity (product, newQuantity) {
      this.isUpdatingQuantity = true;

      this.$store.dispatch('cart/updateQuantity', {
        product: product,
        qty: newQuantity
      }).finally(() => { this.isUpdatingQuantity = false });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
#detailed-cart {
  box-sizing: border-box;

  &.-loading {
    height: 100%;
  }

  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
    padding: 0 var(--spacer-sm);
  }
}

.loader-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .loader {
    position: absolute;
    width: 4.8em;
    height: 4.8em;
    border-radius: 100%;
    border: 2px solid var(--c-secondary);
    border-bottom-color: var(--c-primary);
    animation: rotate 1s linear infinite;
  }
}

.breadcrumbs {
  padding: var(--spacer-base) 0;
}
.detailed-cart {
  .sf-collected-product {
    --collected-product-image-background: none;
    --collected-product-main-margin: 0 var(--spacer-sm);

    .sf-price {
      align-items: flex-start;
      flex-direction: column;
    }

    &__remove {
      position: static;
    }
  }
  ._dropdown-container {
    display: inline-block;
    position: relative;
    margin: var(--spacer-lg) auto;
    align-self: center;
    .sf-button {
      --button-font-size: var(--font-sm);
      --button-font-line-height: 1;
    }
    .sf-dropdown {
      left: 0;
      --dropdown-background: var(--c-primary);
      --c-link: var(--c-light-variant);
      --c-link-hover: var(--c-light-variant);
      --list-item-padding: var(--spacer-xs) var(--spacer-sm);

      .sf-list__item {
        &:hover {
          background-color: var(--c-light);
        }
      }
    }
  }
  &__main {
    padding: 0 var(--spacer-sm);
    position: relative;
    z-index: 1;

    @include for-desktop {
      padding: 0;
    }
  }
  &__aside {
    box-sizing: border-box;
    width: 100%;

    ._shipping-handling-block {
      margin: var(--spacer-xl) 0;
      padding: 0 var(--spacer-xl);
      font-size: var(--font-xs);
      line-height: 1.6;
    }
  }
  @include for-desktop {
    display: flex;
    .sf-collected-product {
      .sf-price {
        flex-direction: row;
      }
      ::v-deep &__details {
        flex-grow: 1.5;
      }
      ::v-deep &__actions {
        flex-grow: 1;
      }
    }
    &__main {
      flex: 1;
    }
    &__aside {
      flex: 0 0 26.8125rem;
      margin: 0 0 0 var(--spacer-xl);
    }
  }
}
.collected-product-list {
  text-align: left;
}
.collected-product {
  --collected-product-padding: var(--spacer-sm) 0;
  --collected-product-title-font-size: var(--font-sm);
  --collected-product-title-font-weight: var(--font-semibold);
  border: 1px solid var(--c-light);
  border-width: 1px 0 0 0;
  &__properties {
    font-size: var(--font-sm);
    margin-bottom: var(--spacer-sm);

    &__icon {
      display: inline-block;
    }
  }
  &__properties > div {
    margin-bottom: var(--spacer-xs);
  }
  @include for-mobile {
    --collected-product-remove-bottom: var(--spacer-sm);
    &:first-of-type {
      border: none;
    }
  }
  @include for-desktop {
    --collected-product-padding: var(--spacer-lg) 0;
    --collected-product-title-font-size: var(--font-base);
  }
}
.actions {
  &__button {
    margin-bottom: var(--spacer-xs);
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
