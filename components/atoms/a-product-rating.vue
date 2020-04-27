<template>
  <div class="a-product-rating" @click="$emit('click')">
    <div class="product__rating">
      <SfRating :score="score" :max="max" />
      <a v-if="!!reviews" href="#" class="product__count">
        ({{ reviews.length }})
      </a>
    </div>
    <SfButton class="sf-button--text desktop-only">
      <slot />
    </SfButton>
  </div>
</template>

<script>
import { SfRating, SfButton } from '@storefront-ui/vue';
export default {
  components: {
    SfRating,
    SfButton
  },
  props: {
    reviews: {
      type: Array,
      default: () => []
    },
    text: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      max: 5
    }
  },
  computed: {
    score () {
      const allScore = this.reviews.reduce((sum, rev) => (sum + (rev.rating || 0)), 0)
      return allScore ? allScore / this.count : allScore
    },
    count () {
      return this.reviews.length
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/typography";

.product {
  &__rating {
    display: flex;
    align-items: center;
    margin: var(--spacer-xs) 0 0 0;
  }
  &__count {
    @include font(
      --count-font,
      var(--font-normal),
      var(--font-sm),
      1.4,
      var(--font-family-secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
}
</style>
