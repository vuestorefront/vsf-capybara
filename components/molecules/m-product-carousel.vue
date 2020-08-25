<template>
  <SfCarousel
    class="m-product-carousel"
    :settings="{
      animationDuration: 3000,
      rewindDuration: 3000
    }"
  >
    <SfCarouselItem v-for="(product, i) in carouselProducts" :key="i">
      <SfProductCard 
        :image="product.image"  
        :link="product.link"
        :wishlist-icon="false"
        link-tag="router-link"
      >
          <template #title>
            <h3 class="sf-product-card__title">
                {{ product.title }}
            </h3>
            <p>
                Ref : {{ product.sku }}
            </p>
            <AProductRating
              @click="openReviewsTab"
              :reviews="reviews"
              >
            </AProductRating> 
            <SfPrice
              class="sf-product-card__price"
              :regular="product.price.regular"
              :special="product.price.special" 
            />     
          </template> 
          <template #price>
            <AAddToCart
              class="sf-add-to-cart__button"
              :qty="qty"
              :product="product.obj_product"
              :disabled="addToCartDisabled"
            />  
          </template>
       </SfProductCard>
    </SfCarouselItem>
  </SfCarousel>
</template>
<script>
import { SfProductCard, SfCarousel ,   SfRating, SfPrice, } from '@storefront-ui/vue';
import { htmlDecode } from '@vue-storefront/core/filters';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { productThumbnailPath } from '@vue-storefront/core/helpers';
import { prepareCategoryProduct } from 'theme/helpers';
import AProductRating from 'theme/components/atoms/a-product-rating';
import AAddToCart from 'theme/components/atoms/a-add-to-cart';

export default {
  name: 'MProductCarousel',
  components: {
    SfCarousel,
    SfProductCard,
    SfRating,
    SfPrice,
    AProductRating,
    AAddToCart
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    qty: {
      type: Number,
      default: 1
    }
  },
  computed: {
    carouselProducts () {
      return this.products.map(prepareCategoryProduct);
    }
  }
};
</script>
