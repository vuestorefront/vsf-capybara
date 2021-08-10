<template>
  <SfTable class="sf-table--bordered table desktop-only" :class="{'table--hidden-header': !isHeaderShow}">
    <SfTableHeading class="table__row" v-if="isHeaderShow">
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
      v-for="product in productsInCart"
      :key="product.id + product.checksum"
      class="table__row"
    >
      <SfTableData class="table__image">
        <SfImage :src="getThumbnailForProduct(product)" />
      </SfTableData>
      <SfTableData class="table__description">
        <div class="product-title">
          {{ product.name | htmlDecode }}
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

<script>
import {
  SfIcon,
  SfImage,
  SfPrice,
  SfTable
} from '@storefront-ui/vue';
import { onlineHelper } from '@vue-storefront/core/helpers';
import { getThumbnailForProduct } from '@vue-storefront/core/modules/cart/helpers';

import { getProductPrice } from 'theme/helpers';

export default {
  name: 'OProductsListTable',
  components: {
    SfIcon,
    SfImage,
    SfPrice,
    SfTable
  },
  props: {
    isHeaderShow: {
      type: Boolean,
      default: true
    },
    productsInCart: {
      type: Array,
      default: () => []
    },
    tableHeaders: {
      type: Array,
      default: () => []
    }
  },
  methods: {
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
        if ([73, 74, 75].includes(product.id) && option.title.toLowerCase() === 'product') {
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
    getProductOptions (product) {
      return onlineHelper.isOnline && product.totals && product.totals.options
        ? product.totals.options
        : product.options || [];
    },
    getProductQuantity (product) {
      return this.isHeaderShow ? product.qty : `x ${product.qty}`;
    },
    getProductRegularPrice (product) {
      return getProductPrice(product, {}).regular;
    },
    getProductSpecialPrice (product) {
      return getProductPrice(product, {}).special;
    },
    getThumbnailForProduct (product) {
      if (product.thumbnail && product.thumbnail.includes('://')) {
        return product.thumbnail;
      }

      return getThumbnailForProduct(product);
    },
    isCustomOption (product, productOption) {
      if (!product.custom_options) {
        return false;
      }

      return product.custom_options.find(option => option.title === productOption.label) !== undefined;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.table {
  margin: 0 0 var(--spacer-base) 0;

  &__row {
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

  @include for-desktop {
    &__header {
      text-align: center;

      &:last-child {
        text-align: right;
      }
    }

    &__data {
      text-align: center;
    }

    &__description {
      text-align: left;
      flex: 1 0 12rem;

      .product-title {
        font-weight: var(--font-semibold);

      }

      .bundle-product-option {
        font-size: var(--font-xs);

        &__icon {
          display: inline-block;
        }
      }
    }

    &__image {
      --image-width: 5.125rem;
      text-align: left;
    }
  }

  &.table--hidden-header {
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
}
</style>
