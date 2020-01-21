<template>
  <div class="m-review-list">
    <SfReview
      v-for="(review, i) in pageReviews"
      :key="i"
      class="m-review-list__record"
      :author="review.author"
      :date="review.date"
      :message="review.message"
      :rating="review.rating"
      :max-rating="5"
      :readMoreText="$t('Read more')"
      :hideFullText="$t('Read less')"
    />
    <SfPagination
      :current="currentPage"
      :visible="visible"
      :total="total"
      @click="value => currentPage = value"/>
  </div>
</template>
<script>
import { SfReview, SfPagination } from '@storefront-ui/vue';
export default {
  name: 'MReviewList',
  components: {
    SfReview,
    SfPagination
  },
  data () {
    return {
      currentPage: 1,
      visible: 2
    }
  },
  props: {
    reviews: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    total () {
      return Math.ceil(this.reviews.length / this.visible)
    },
    pageReviews () {
      const startIndex = (this.currentPage - 1) * this.visible
      const endIndex = startIndex + this.visible
      return this.reviews.slice(startIndex, endIndex)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.m-review-list {
  &__record {
    padding-bottom: $spacer-big;
    @include for-desktop {
      padding-bottom: $spacer-extra-big;
      border-bottom: 1px solid $c-light;
    }
    & + & {
      padding-top: $spacer-extra-big;
      border-top: 1px solid $c-light;
      @include for-desktop {
        border-top: 0;
        padding-top: $spacer-extra-big;
      }
    }
  }
}
</style>