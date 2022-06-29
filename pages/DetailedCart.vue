<template>
  <div id="detailed-cart" :class="{ '-loading': isLoading }">
    <div class="loader-container" v-if="isLoading">
      <div class="loader" />
    </div>
    <div class="detailed-cart" v-else>
      <div class="detailed-cart__main">
        <ProductionSpotCountdown
          :can-show="canShowProductionSpotCountdown"
          class="_production-spot-countdown"
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
                :key="getCartItemKey(product)"
                :image="getThumbnailForProductExtend(product)"
                image-width="140"
                image-height="140"
                :title="product.name"
                class="sf-collected-product--detailed collected-product"
              >
                <template #configuration>
                  <div class="collected-product__properties" v-if="getPlushieName(product)">
                    {{ getPlushieName(product) | htmlDecode }}
                  </div>
                  <div class="collected-product__properties" v-if="getPlushieDesc(product)">
                    {{ getPlushieDesc(product) | htmlDecode }}
                  </div>
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
                <template #input>
                  <SfQuantitySelector
                    :qty="product.qty"
                    :disabled="isUpdatingQuantity"
                    @input="changeProductQuantity(product, $event)"
                  />
                </template>
                <template #price>
                  <div />
                </template>
                <template #actions>
                  <SfButton v-if="showEditButton(product.sku)" class="sf-button--text actions__button" @click="editHandler(product)">
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
                      @click.native="onDropdownActionClick(action)"
                    >
                      {{ action.label }}
                    </router-link>
                  </SfListItem>
                </SfList>
              </SfDropdown>
            </div>
          </div>
          <div v-else key="empty-cart" class="empty-cart">
            <SfHeading
              title="Your cart is empty"
              :level="2"
              subtitle="Looks like you haven’t added any items to the cart yet. Start
                shopping to fill it in."
            />
            <SfButton
              class="sf-button--full-width color-primary empty-cart__button"
              @click="processStartShopping"
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
import debounce from 'lodash-es/debounce';
import {
  SfPrice,
  SfList,
  SfDropdown,
  SfCollectedProduct,
  SfButton,
  SfImage,
  SfProperty,
  SfHeading,
  SfIcon,
  SfQuantitySelector
} from '@storefront-ui/vue';
import { OrderSummary } from './DetailedCart/index.js';
import { mapGetters, mapState } from 'vuex';
import { getCartItemPrice } from 'src/modules/shared';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { ProductId } from 'src/modules/budsies';
import getCartItemKey from 'src/modules/budsies/helpers/get-cart-item-key.function';
import CartEvents from 'src/modules/shared/types/cart-events';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus';
import { mapMobileObserver } from '@storefront-ui/vue/src/utilities/mobile-observer';
import { getBundleOptionsValues, getSelectedBundleOptions } from '@vue-storefront/core/modules/catalog/helpers/bundleOptions'
import { CART_UPD_ITEM } from '@vue-storefront/core/modules/cart/store/mutation-types'
import ProductionSpotCountdown from 'src/modules/promotion-platform/components/ProductionSpotCountdown.vue';
import isCustomProduct from 'src/modules/shared/helpers/is-custom-product.function';
import { htmlDecode } from '@vue-storefront/core/filters';

const CHANGE_QUANTITY_DEBOUNCE_TIME = 1000;

const foreversProductsSkus = [
  'ForeversDog_bundle',
  'ForeversCat_bundle',
  'ForeversOther_bundle'
]

const printedProductSkus = [
  'customPrintedSocks_bundle',
  'customPrintedMasks_bundle',
  'customPrintedKeychains_bundle',
  'customFeltedMagnets_bundle'
]

const editableProductsSkus = [
  ...foreversProductsSkus,
  ...printedProductSkus
];

export default {
  name: 'DetailedCart',
  components: {
    SfPrice,
    SfList,
    SfDropdown,
    SfCollectedProduct,
    SfImage,
    SfButton,
    SfHeading,
    SfProperty,
    SfIcon,
    SfQuantitySelector,
    OrderSummary,
    ProductionSpotCountdown
  },
  data () {
    return {
      isUpdatingQuantity: false,
      isDropdownOpen: false,
      dropdownActions: [
        {
          label: 'Petsies',
          url: '/forevers-pet-plush/'
        },
        {
          label: 'Pet Pillow',
          url: '/pet-pillow/'
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
            name: 'printed-socks-creation-page'
          }
        },
        {
          label: 'Face Masks',
          url: {
            name: 'printed-masks-creation-page'
          }
        },
        {
          label: 'Pet Keychains',
          url: {
            name: 'printed-keychains-creation-page'
          }
        },
        {
          label: 'Felted Magnets',
          url: {
            name: 'felted-magnets-creation-page'
          }
        }
      ],
      isMounted: false,
      syncQuantityDebounced: undefined
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
    ...mapMobileObserver(),
    totalItems () {
      return this.products.reduce(
        (totalItems, product) => totalItems + parseInt(product.qty, 10),
        0
      );
    },
    isLoading () {
      return !this.isMounted || !this.cartIsLoaded;
    },
    canShowProductionSpotCountdown () {
      return this.products.some((product) => isCustomProduct(product.id));
    }
  },
  async mounted () {
    this.syncQuantityDebounced = debounce(this.syncQuantity, CHANGE_QUANTITY_DEBOUNCE_TIME);
    await this.$nextTick();
    this.isMounted = true;
  },
  beforeDestroy () {
    this.syncQuantityDebounced.cancel();
  },
  methods: {
    getPlushieName (product) {
      if (!product.plushieName) {
        return '';
      }

      let name = product.plushieName;

      if (product.plushieBreed) {
        name += ', ' + product.plushieBreed;
      }

      return this.truncate(name);
    },
    getPlushieDesc (product) {
      if (!product.plushieDescription) {
        return '';
      }

      return this.truncate(product.plushieDescription, 150, 50);
    },
    editHandler (product) {
      if (foreversProductsSkus.includes(product.sku)) {
        this.$router.push({ name: 'forevers-create', query: { id: product.plushieId } });
      } else if (printedProductSkus.includes(product.sku)) {
        this.$router.push({ name: 'printed-product',
          params: { sku: product.sku },
          query: {
            product_design: this.getPrintedProductDesign(product),
            existingPlushieId: product.plushieId
          }
        });
      }
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
    getProductRegularPrice (product) {
      return getCartItemPrice(product, {}).regular;
    },
    getProductSpecialPrice (product) {
      return getCartItemPrice(product, {}).special;
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
    async changeProductQuantity (product, qty) {
      this.$store.commit(`cart/${CART_UPD_ITEM}`, { product, qty });

      if (this.$store.getters['cart/isCartSyncEnabled']) {
        this.syncQuantityDebounced();
      }
    },
    syncQuantity () {
      this.isUpdatingQuantity = true;

      return this.$store.dispatch('cart/sync', {
        forceClientState: true
      }).finally(() => {
        this.isUpdatingQuantity = false;
      });
    },
    onDropdownActionClick (action) {
      EventBus.$emit(CartEvents.MAKE_ANOTHER_FROM_CART, action.label);
    },
    showEditButton (productSku) {
      return editableProductsSkus.includes(productSku);
    },
    truncate (text, desktopLength = 75, mobileLength = 50) {
      const maxLength = this.isMobile ? mobileLength : desktopLength;

      if (text.length <= maxLength) {
        return text;
      }

      return text.substring(0, maxLength) + '...';
    },
    getPrintedProductDesign (product) {
      const selectedBundleOptions = getSelectedBundleOptions(product);
      const productBundleOptions = product.bundle_options.filter((option) => option.title.toLowerCase() === 'product');
      const selectedBundleOptionsValues = getBundleOptionsValues(selectedBundleOptions, productBundleOptions);

      return selectedBundleOptionsValues[0].sku;
    },
    getCartItemKey (cartItem) {
      return getCartItemKey(cartItem);
    },
    processStartShopping () {
      this.$router.push(localizedRoute('/'));
    }
  },
  metaInfo () {
    return {
      title: htmlDecode(this.$t('Shopping Cart'))
    };
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
    width: 100%;
    margin: auto;
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

.detailed-cart {
  ._production-spot-countdown {
    margin: var(--spacer-sm) 0;
  }

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
  .sf-quantity-selector {
    ::v-deep {
      .sf-quantity-selector__button {
        --button-background: transparent;
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
        flex-grow: 3;
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

  ::v-deep {
    .sf-link {
      pointer-events: none;
      cursor: default;
    }
  }

  &__properties {
    font-size: var(--font-xs);
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
    align-self: flex-start;
  }
}
.empty-cart {
  --heading-title-color: var(--c-primary);
  --heading-title-margin: var(--spacer-2xl) 0 var(--spacer-base) 0;
  --heading-subtitle-margin: 0 0 var(--spacer-xl) 0;
  --heading-title-font-weight: var(--font-semibold);
  display: flex;
  flex: 1;
  align-items: center;
  flex-direction: column;
  @include for-desktop {
    &__button {
      --button-width: 20.9375rem;
    }
  }
}
</style>
