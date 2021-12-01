<template>
  <div class="storyblok-product" v-if="product">
    <router-link
      class=""
      :to="link"
    >
      <div
        class="_product-image"
      >
        <product-image
          :image="thumbnailObj"
          :alt="name | htmlDecode"
          :calc-ratio="false"
        />
      </div>

      <p class="">
        {{ name | htmlDecode }}
      </p>

      <span class="">{{ price | price(currentStoreView) }}</span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService';
import { productThumbnailPath } from '@vue-storefront/core/helpers';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import ProductImage from '../core/ProductImage.vue';
import { LocalizedRoute, StoreView } from 'core/lib/types';
import config from 'config';
import Product from 'core/modules/catalog/types/Product';
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { getProductPrice } from 'theme/helpers';

import ProductData from './interfaces/product-data.interface';

export default Blok.extend({
  name: 'StoryblokProductBlock',
  components: {
    ProductImage
  },
  data: function () {
    return {
      placeholder: '/assets/placeholder.jpg',
      product: undefined as Product | undefined
    }
  },
  computed: {
    itemData (): ProductData {
      return this.item as ProductData;
    },
    currentStoreView (): () => StoreView {
      return currentStoreView;
    },
    price (): number | string {
      if (!this.product) {
        return ''
      }

      const price = getProductPrice(this.product, {}, false);

      return price.special ? price.special : price.regular;
    },
    name (): string {
      if (!this.product) {
        return ''
      }
      return this.product.name
    },
    link (): string | LocalizedRoute {
      if (!this.product) {
        return ''
      }

      if (!this.product.slug) {
        return '';
      }

      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    thumbnail (): string {
      if (!this.product) {
        return ''
      }
      let thumbnail = productThumbnailPath(this.product)

      // TODO: Figure out correct type definition
      return (this as any).getThumbnail(thumbnail, config.products.thumbnails.width, config.products.thumbnails.height)
    },
    thumbnailObj (): {src: string, loading: string, error: string} {
      return {
        src: this.thumbnail,
        loading: this.placeholder,
        error: this.placeholder
      }
    }
  },
  created: async function (): Promise<void> {
    if (this.product) {
      return
    }

    await this.loadData()
  },
  methods: {
    async loadData () {
      this.product = await this.$store.dispatch(
        'product/single',
        {
          options: {
            id: this.itemData.product_id
          },
          key: 'id',
          skipCache: true
        }
      )
    }
  },
  watch: {
    item: async function () {
      await this.loadData()
    }
  }
});
</script>

<style lang="scss" scoped>
.storyblok-product {
  display: flex;
  justify-content: center;

  ._product-image {
    background-color: #f2f2f2;

    img {
      position: relative;
      top: 0;
      left: 0;
      transform: none;
    }

    .product-image {
      width: auto;
      height: auto;
    }
  }
}
</style>
