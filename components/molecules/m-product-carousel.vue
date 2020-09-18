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
         :link="product.link"
        :wishlist-icon="false"
        link-tag="router-link"
      >
          <template #title>
            <h3 class="sf-product-card__title">
                {{ product.title }}
            </h3>
            <p class="reference">
                Ref : {{ product.sku }}
            </p>
            <AProductRating />
             <div class="d-flex align-start justify-between">
                <SfPrice
                  class="sf-product-card__price"
                  :regular="product.price.regular"
                  :special="product.price.special" 
                />  
                <p class="stock" v-if="product.is_in_stock">In stock</p>
                <p class="out-of-stock" v-else>Out of stock</p> 
             </div>
          </template> 
          <template #price>
            <AAddToCart
              class="sf-add-to-cart__button"
              :qty="qty"
              :product="product.obj_product"
              :disabled="isProductDisabled(product)"
            />  
          </template>
           <template #image>
            <div class="sf-image sf-product-card__image sf-image--has-size" data-loaded="true" style="--_image-width:216;--_image-height:326;">
              <img width="216" height="326" alt="" style="" :src="product.image" @error="$event.target.src=placeholder"/> 
            </div>
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
  data () {
    return {
      placeholder: '/assets/placeholder.jpg'
    };
  },
  props: {
    products: {
      type: Array,
      default: () => []
    },
    reviews: {
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
  },
  methods: {  
    isProductDisabled ( product ) {
      return product.is_in_stock ? false : true ;
    },
  }
};
</script>
