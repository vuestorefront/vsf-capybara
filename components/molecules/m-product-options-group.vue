<template>
  <div class="m-product-options-group">
    <SfGroupedProduct>
      <SfGroupedProductItem
        v-for="product in products"
        :key="product.id"
        v-model="product.qty"
        :image="getImage(product)"
        :image-width="imageSize.width"
        :image-height="imageSize.height"
        :title="product.name"
        :qty-min="1"
      >
        <template #details>
          <div class="sku">
            {{ product.sku }}
          </div>
        </template>
        <template #price>
          <AProductPrice
            class="sf-grouped-product-item__price"
            :product="product"
          />
        </template>
      </SfGroupedProductItem>
    </SfGroupedProduct>
  </div>
</template>

<script>
import config from 'config'
import { SfGroupedProduct } from '@storefront-ui/vue';
import AProductPrice from 'theme/components/atoms/a-product-price'
export default {
  name: 'MProductOptionsGroup',
  components: {
    AProductPrice,
    SfGroupedProduct
  },
  props: {
    productOptions: {
      type: Array,
      required: true
    }
  },
  computed: {
    products () {
      return Object.values(this.productOptions)
        .filter(productOption => productOption.product)
        .map(productOption => productOption.product)
    },
    imageSize () {
      const width = config.products.thumbnails.width;
      const height = config.products.thumbnails.height;
      return { width, height }
    },
    getImage () {
      return product => this.getThumbnail(product.image, this.imageSize.width, this.imageSize.height)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-product-options-group {
  margin: 0 var(--spacer-sm);
  @include for-desktop {
    margin: 0 var(--spacer-xl);
  }
  ::v-deep {
    .sf-grouped-product-item__aside {
      display: flex;
      justify-content: flex-end;
    }
  }
}
.sku {
  color: #a3a5ad;
}
</style>
