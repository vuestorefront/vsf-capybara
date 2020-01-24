<template>
  <div class="m-review-list">
    <SfReview
      v-for="(review, i) in pageReviews"
      :key="i"
      class="record"
      :author="review.author"
      :date="review.date"
      :message="review.message"
      :rating="review.rating"
      :max-rating="5"
      :read-more-text="$t('Read more')"
      :hide-full-text="$t('Read less')"
    />
    <SfPagination
      :current="currentPage"
      :visible="visible"
      :total="total"
      @click="setCurrentPage"
    />
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
      currentPage: 1
    }
  },
  props: {
    reviews: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Number,
      default: 2
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
  },
  methods: {
    setCurrentPage (newPage) {
      this.currentPage = newPage
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

.record {
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
</style>
