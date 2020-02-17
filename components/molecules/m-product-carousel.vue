<template>
  <SfCarousel class="m-product-carousel">
    <SfCarouselItem v-for="(product, i) in carouselProducts" :key="i">
      <SfProductCard
        :title="product.title"
        :image="product.image"
        :regular-price="product.price.regular"
        :special-price="product.price.special"
        :max-rating="product.rating.max"
        :score-rating="product.rating.score"
        :link="product.link"
        :wishlist-icon="false"
        link-tag="router-link"
      />
    </SfCarouselItem>
  </SfCarousel>
</template>
<script>
import { SfProductCard, SfCarousel } from '@storefront-ui/vue';
import { htmlDecode } from '@vue-storefront/core/filters';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { productThumbnailPath } from '@vue-storefront/core/helpers';
import { getProductPrice } from 'theme/helpers';
export default {
  name: 'MProductCarousel',
  components: {
    SfCarousel,
    SfProductCard
  },
  props: {
    products: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    carouselProducts () {
      return this.products.map(product => {
        return {
          title: htmlDecode(product.name),
          image: this.getThumbnail(
            productThumbnailPath(product),
            config.products.thumbnails.width,
            config.products.thumbnails.height
          ),
          link: formatProductLink(product, currentStoreView().storeCode),
          price: getProductPrice(product),
          rating: {
            max: 5,
            score: 5
          }
        };
      });
    }
  }
};
</script>
