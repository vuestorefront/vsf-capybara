<template>
  <SfTable
    class="sf-table--bordered o-cart-items-table desktop-only"
    :class="{'o-cart-items-table--hidden-header': !shouldShowHeader}"
  >
    <SfTableHeading class="table__row" v-if="shouldShowHeader">
      <SfTableHeader class="table__header table__image">
        {{ $t('Thumbnail') }}
      </SfTableHeader>
      <SfTableHeader
        v-for="tableHeader in tableHeaders"
        :key="tableHeader"
        class="table__header"
        :class="{
          table__description: tableHeader === $t('Description'),
          table__price: tableHeader === $t('Price')
        }"
      >
        {{ tableHeader }}
      </SfTableHeader>
    </SfTableHeading>
    <SfTableRow
      v-for="product in cartItems"
      :key="getCartItemKey(product)"
      class="table__row"
    >
      <SfTableData class="table__image">
        <SfImage :src="getThumbnailForProduct(product)" />
      </SfTableData>
      <SfTableData class="table__description">
        <div class="product-title">
          {{ product.name | htmlDecode }}
        </div>
        <div class="custom-plushie-name" v-if="getPlushieName(product)">
          {{ getPlushieName(product) | htmlDecode }}
        </div>
        <div
          class="bundle-product-option"
          v-for="option in getBundleProductOptions(product)"
          :key="option"
        >
          <SfIcon
            icon="check"
            size="xxs"
            color="blue-primary"
            class="bundle-product-option__icon"
          />
          {{ option }}
        </div>
        <div
          class="product-options"
          v-for="option in getProductOptions(product)"
          :key="option.label"
        >
          <template v-if="isCustomOption(product, option)">
            {{ option.label }}: {{ option.value }}
          </template>
          <template v-else>
            {{ option.value }}
          </template>
        </div>
      </SfTableData>
      <SfTableData class="table__data">
        {{ getProductQuantity(product) }}
      </SfTableData>
      <SfTableData class="table__data">
        <SfPrice
          :regular="getProductRegularPrice(product)"
          :special="getProductSpecialPrice(product)"
          class="product-price"
        />
      </SfTableData>
    </SfTableRow>
  </SfTable>
</template>

<script lang="ts">
import { PropType } from 'vue';
import {
  SfIcon,
  SfImage,
  SfPrice,
  SfTable
} from '@storefront-ui/vue';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';

import { getCartItemPrice } from 'theme/helpers';
import CartItem from 'core/modules/cart/types/CartItem';
import CartItemOption from 'core/modules/cart/types/CartItemOption';
import { ProductId } from 'src/modules/budsies';
import getCartItemKey from 'src/modules/budsies/helpers/get-cart-item-key.function';
import { mapMobileObserver } from '@storefront-ui/vue/src/utilities/mobile-observer';

export default {
  name: 'OCartItemsTable',
  components: {
    SfIcon,
    SfImage,
    SfPrice,
    SfTable
  },
  props: {
    shouldShowHeader: {
      type: Boolean,
      default: true
    },
    cartItems: {
      type: Array as PropType<CartItem[]>,
      default: () => []
    }
  },
  data () {
    return {
      tableHeaders: [
        this.$t('Description'),
        this.$t('Quantity'),
        this.$t('Price')
      ]
    }
  },
  computed: {
    ...mapMobileObserver()
  },
  methods: {
    getBundleProductOptions (product: CartItem) {
      if (!product.bundle_options ||
          product.bundle_options.length < 2 ||
          !product.product_option ||
          !product.product_option.extension_attributes ||
          !product.product_option.extension_attributes.bundle_options
      ) {
        return [];
      }

      let result: string[] = [];
      const productBundleOptions = product.product_option.extension_attributes.bundle_options;

      product.bundle_options.forEach(option => {
        // Hide Forevers simple products
        if (typeof product.id === 'number' &&
         [ProductId.FOREVERS_DOG, ProductId.FOREVERS_CAT, ProductId.FOREVERS_OTHER]
           .includes(product.id) &&
          option.title.toLowerCase() === 'product'
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

          if (!productLink || !productLink.product) {
            return;
          }

          result.push(productLink.product.name);
        });
      });

      return result;
    },
    getProductOptions (product: CartItem): CartItemOption[] {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || [];
    },
    getProductQuantity (product: CartItem): number | string {
      return this.shouldShowHeader ? product.qty : `x ${product.qty}`;
    },
    getProductRegularPrice (product: CartItem): string {
      return getCartItemPrice(product, {}).regular;
    },
    getProductSpecialPrice (product: CartItem): string {
      return getCartItemPrice(product, {}).special;
    },
    getThumbnailForProduct (product: CartItem): string {
      if (product.thumbnail && product.thumbnail.includes('://')) {
        return product.thumbnail;
      }

      return getThumbnailForProduct(product);
    },
    getPlushieName (product: CartItem): string {
      if (!product.plushieName) {
        return '';
      }

      let name = product.plushieName;

      if (product.plushieBreed) {
        name += ', ' + product.plushieBreed;
      }

      return this.truncate(name);
    },
    isCustomOption (product: CartItem, productOption: CartItemOption) {
      if (!product.custom_options) {
        return false;
      }

      return product.custom_options.find(option => option.title === productOption.label) !== undefined;
    },
    truncate (text: string, desktopLength = 75, mobileLength = 50): string {
      const maxLength = this.isMobile ? mobileLength : desktopLength;

      if (text.length <= maxLength) {
        return text;
      }

      return text.substring(0, maxLength) + '...';
    },
    getCartItemKey (cartItem: CartItem): string {
      return getCartItemKey(cartItem);
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-cart-items-table {
  margin: 0 0 var(--spacer-base) 0;

  .table__row {
    justify-content: space-between;
    align-items: center;
  }

  .sf-table {
    &__data {
      --table-data-color: var(--c-text);
    }

    &__row {
      --table-row-box-shadow: none;
    }
  }

  .product-price {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  &.o-cart-items-table--hidden-header {
      .product-price {
        ::v-deep .sf-price__old {
            margin: 0;
        }
      }

      .table__description {
        flex-basis: 6rem;
      }

      .table__image {
        --image-width: 8.125rem;
        min-width: var(--image-width);
        margin-right: 1em;
      }
  }

  @include for-desktop {
    .table__header {
      text-align: center;

      &:last-child {
        text-align: right;
      }
    }

    .table__data {
      text-align: center;
    }

    .table__description {
      text-align: left;
      flex: 1 0 12rem;

      .product-title {
        font-weight: var(--font-semibold);
      }

      .bundle-product-option,
      .custom-plushie-name {
        font-size: var(--font-xs);

        &__icon {
          display: inline-block;
        }
      }
    }

    .table__image {
      --image-width: 5.125rem;
      text-align: left;
      margin-right: var(--spacer-sm);
      min-width: var(--image-width);
    }
  }
}
</style>
