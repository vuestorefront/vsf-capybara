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
        link-tag="a"
        :is-on-wishlist="isOnWishlist(product.data)"
        class="product-card"
        @click:wishlist="toggleWishlist(product.data)"
      />
    </SfCarouselItem>
  </SfCarousel>
</template>
<script>
import { mapGetters } from 'vuex';
import { SfProductCard, SfCarousel } from '@storefront-ui/vue';
import { price, htmlDecode } from '@vue-storefront/core/filters';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { formatProductLink } from '@vue-storefront/core/modules/url/helpers';
import { productThumbnailPath } from '@vue-storefront/core/helpers';
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
    ...mapGetters({
      isOnWishlist: 'wishlist/isOnWishlist'
    }),
    carouselProducts () {
      return this.products.map(product => {
        return {
          data: product,
          title: htmlDecode(product.name),
          image: this.getThumbnail(
            productThumbnailPath(product),
            config.products.thumbnails.width,
            config.products.thumbnails.height
          ),
          link: formatProductLink(product, currentStoreView().storeCode),
          price: {
            regular: price(parseFloat(product.priceInclTax)),
            special: price(parseFloat(product.specialPriceInclTax))
          },
          rating: {
            max: 5,
            score: 5
          }
        };
      });
    }
  },
  methods: {
    toggleWishlist (product) {
      const isProductOnWishlist = this.isOnWishlist(product);
      const message = isProductOnWishlist
        ? 'Product {productName} has been removed from wishlist!'
        : 'Product {productName} has been added to wishlist!';
      const action = isProductOnWishlist
        ? 'wishlist/removeItem'
        : 'wishlist/addItem';

      this.$store.dispatch(action, product);
      this.$store.dispatch(
        'notification/spawnNotification',
        {
          type: 'success',
          message: this.$t(message, { productName: product.name }),
          action1: { label: this.$t('OK') }
        },
        { root: true }
      );
    }
  }
};
</script>
