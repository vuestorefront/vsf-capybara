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

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService'
import { productThumbnailPath } from '@vue-storefront/core/helpers'
import { currentStoreView } from '@vue-storefront/core/lib/multistore'
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers'
import ProductImage from '../core/ProductImage'
import config from 'config'

export default {
  name: 'ProductBlock',
  extends: Blok,
  components: {
    ProductImage
  },
  computed: {
    currentStoreView () {
      return currentStoreView
    },
    price () {
      if (!this.product || !this.product.price_incl_tax) {
        return ''
      }
      return this.product.price_incl_tax
    },
    name () {
      if (!this.product) {
        return ''
      }
      return this.product.name
    },
    link () {
      if (!this.product) {
        return ''
      }
      return formatProductLink(this.product, currentStoreView().storeCode)
    },
    thumbnail () {
      if (!this.product) {
        return ''
      }
      let thumbnail = productThumbnailPath(this.product)
      return this.getThumbnail(thumbnail, config.products.thumbnails.width, config.products.thumbnails.height)
    },
    thumbnailObj () {
      return {
        src: this.thumbnail,
        loading: this.placeholder,
        error: this.placeholder
      }
    }
  },
  created: async function () {
    if (this.product) {
      return
    }

    await this.loadData()
  },
  methods: {
    async loadData () {
      this.product = await ProductService.getProductByKey({
        options: {
          id: this.item.id
        },
        key: 'id',
        skipCache: true
      })
    }
  },
  watch: {
    item: async function () {
      await this.loadData()
    }
  },
  props: {
    product: {
      type: Object,
      default: undefined
    }
  },
  data: function () {
    return {
      placeholder: '/assets/placeholder.jpg'
    }
  }
}
</script>

<style lang="scss">
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
