<template>
  <div class="m-product-short-info">
    <div class="m-product-short-info__mobile-top">
      <div>
        <SfHeading
          itemprop="name"
          :title="product.name | htmlDecode"
          :level="1"
          class="sf-heading--no-underline sf-heading--left m-product-short-info__heading"
        />
        <div class="m-product-short-info__sub">
          <!-- <AProductPrice
            class="sf-price--big m-product-short-info__sub-price"
            :product="product"
            :custom-options="customOptions"
          /> -->
          <AProductRating
            @click:stars="handleOpenReviewModal"
            @click:text="handleOpenReviewList"
            :reviews="reviews"
          >
            <span class="m-product-short-info__rating-text desktop-only">
              {{ $t("Read all {count} review", { count: reviewsCount }) }}
            </span>
            <span class="m-product-short-info__rating-text mobile-only">
              {{ `(${reviewsCount})` }}
            </span>
          </AProductRating>
        </div>
      </div>
    </div>
    <div class="m-product-short-info__description desktop-only" itemprop="sku">
      {{ $t("SKU: {sku}", { sku: product.sku }) }}
    </div>
  </div>
</template>
<script>
import { SfHeading } from '@storefront-ui/vue';
import AProductRating from 'theme/components/atoms/a-product-rating';
// import AProductPrice from 'theme/components/atoms/a-product-price';
import { createSmoothscroll } from 'theme/helpers'
export default {
  name: 'MProductShortInfo',
  components: {
    SfHeading,
    AProductRating
    // AProductPrice
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
    handleOpenReviewModal () {
      this.$bus.$emit('modal-show', 'modal-add-review')
    },
    handleOpenReviewList () {
      const reviewsEl = document.querySelector('#m-product-additional-info')
      if (!reviewsEl) return
      const currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop
      createSmoothscroll(currentScroll, reviewsEl.getBoundingClientRect().top)
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.m-product-short-info {
  &__description {
    margin: $spacer-extra-big 0 ($spacer-big * 3) 0;
    font-family: $body-font-family-secondary;
    font-size: $font-size-regular-mobile;
    line-height: 1.6;
    @include for-desktop {
      font-size: $font-size-regular-desktop;
    }
  }
  &__heading {
    margin-top: $spacer-big;
    ::v-deep .sf-heading__title {
      font-size: $font-size-big-mobile;
      font-weight: $body-font-weight-primary;
      @include for-desktop {
        font-size: $h1-font-size-desktop;
        font-weight: $body-font-weight-secondary;
      }
    }
    @include for-desktop {
      margin-top: 0;
    }
  }
  &__mobile-top {
    display: flex;
    align-items: center;
    @include for-desktop {
      display: block;
    }
  }
  &__sub {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__sub-price {
    flex-basis: 100%;
    margin-top: $spacer-big / 4;
    @include for-desktop {
      flex-basis: auto;
      margin-top: $spacer-big / 2;
    }
  }
  &__rating-text {
    margin-left: 10px;
    font-size: 0.75rem;
  }
}
</style>
