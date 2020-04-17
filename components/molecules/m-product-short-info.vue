<template>
  <div class="m-product-short-info">
    <div class="product__header">
      <SfHeading
        :title="product.name  | htmlDecode"
        :level="3"
        class="sf-heading--no-underline sf-heading--left"
      />
      <SfIcon
        icon="drag"
        size="xl"
        color="gray-secondary"
        class="product__drag-icon mobile-only"
      />
    </div>
    <div class="product__price-and-rating">
      <AProductPrice
        v-if="product.type_id !== 'grouped'"
        :product="product"
        :custom-options="customOptions"
      />
      <AProductRating
        @click="openReviewsTab"
        :reviews="reviews"
      >
        {{ $t("Read all {count} review", { count: reviewsCount }) }}
      </AProductRating>
    </div>
    <div class="product__description desktop-only" v-html="product.description" />
  </div>
</template>

<script>
import { SfHeading, SfIcon, SfPrice, SfButton } from '@storefront-ui/vue';
import AProductRating from 'theme/components/atoms/a-product-rating';
import AProductPrice from 'theme/components/atoms/a-product-price';
import { createSmoothscroll } from 'theme/helpers'
export default {
  name: 'MProductShortInfo',
  components: {
    SfHeading,
    SfIcon, 
    SfPrice,
    SfButton,
    AProductRating,
    AProductPrice
  },
  props: {
    product: {
      type: Object,
      default: () => ({})
    },
    customOptions: {
      type: Object,
      default: () => ({})
    },
    reviews: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    reviewsCount () {
      return this.reviews.length
    }
  },
  methods: {
    openReviewsTab () {
      this.$store.commit('ui/setActiveProductTab', 2);
      const reviewsEl = document.querySelector('#m-product-additional-info')
      if (!reviewsEl) return
      window.scrollTo(0, reviewsEl.getBoundingClientRect().top)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.product {
  &__header {
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    margin: var(--spacer-xs) var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__description {
    color: var(--c-link);
    @include font(
      --product-description-font,
      var(--font-light),
      var(--font-base),
      1.6,
      var(--font-family-primary)
    );
  }
}
</style>
