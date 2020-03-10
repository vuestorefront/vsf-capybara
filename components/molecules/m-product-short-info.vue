<template>
  <div class="m-product-short-info">
    <div class="mobile-top">
      <div>
        <SfHeading
          itemprop="name"
          :title="product.name | htmlDecode"
          :level="1"
          class="sf-heading--no-underline sf-heading--left heading"
        />
        <div class="sub">
          <AProductPrice
            v-if="product.type_id !== 'grouped'"
            class="sf-price--big sub-price"
            :product="product"
            :custom-options="customOptions"
          />
          <AProductRating
            @click="openReviewsTab"
            :reviews="reviews"
          >
            <span class="rating-text desktop-only">
              {{ $t("Read all {count} review", { count: reviewsCount }) }}
            </span>
            <span class="rating-text mobile-only">
              {{ `(${reviewsCount})` }}
            </span>
          </AProductRating>
        </div>
      </div>
    </div>
    <div class="description desktop-only" itemprop="sku">
      {{ $t("SKU: {sku}", { sku: product.sku }) }}
    </div>
  </div>
</template>
<script>
import { SfHeading } from '@storefront-ui/vue';
import AProductRating from 'theme/components/atoms/a-product-rating';
import AProductPrice from 'theme/components/atoms/a-product-price';
import { createSmoothscroll } from 'theme/helpers'
export default {
  name: 'MProductShortInfo',
  components: {
    SfHeading,
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
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.description {
  margin: var(--spacer-extra-big) 0 calc(var(--spacer-big) * 3) 0;
  font-family: var(--body-font-family-secondary);
  font-size: var(--font-size-regular);
  line-height: 1.6;
}
.heading {
  margin-top: var(--spacer-big);
  ::v-deep .sf-heading__title {
    font-size: var(--font-size-big);
    font-weight: var(--body-font-weight-primary);
    @include for-desktop {
      font-size: var(--h1-font-size);
      font-weight: var(--body-font-weight-secondary);
    }
  }
  @include for-desktop {
    margin-top: 0;
  }
}
.mobile-top {
  display: flex;
  align-items: center;
  @include for-desktop {
    display: block;
  }
}
.sub {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}
.sub-price {
  flex-basis: 100%;
  margin-top: var(--spacer-big) / 4;
  @include for-desktop {
    flex-basis: auto;
    margin-top: var(--spacer-big) / 2;
  }
}
.rating-text {
  margin-left: 10px;
  font-size: 0.75rem;
}
</style>
