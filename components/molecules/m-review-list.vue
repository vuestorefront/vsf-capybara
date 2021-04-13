<template>
  <div class="m-review-list">
    <SfReview
      v-for="(review, i) in pageReviews"
      :key="i"
      class="product__review"
      :author="review.author"
      :date="review.date"
      :message="review.message"
      :rating="review.rating"
      :max-rating="5"
      :read-more-text="$t('Read more')"
      :hide-full-text="$t('Read less')"
    />
    <SfPagination
      v-if="total > 1"
      :current="currentPage"
      :visible="visible"
      :total="total"
      page-param-name="reviewPage"
      class="product__reviews-pagination"
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
  },
  watch: {
    $route: {
      immediate: true,
      handler (to, from) {
        if (to.query.reviewPage) {
          this.setCurrentPage(parseInt(to.query.reviewPage) || 1);
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.product {
  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
    &:last-of-type {
      border: none;
      padding-bottom: 0;
      margin-bottom: 0;
    }
    @include for-desktop {
      padding-bottom: 0;
    }
  }
  &__reviews-pagination {
    margin: var(--spacer-lg) 0 0;
  }
}
.m-review-list {
  margin-top: var(--spacer-base);
}
</style>
