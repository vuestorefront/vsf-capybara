<template>
  <div class="a-product-rating" @click="$emit('click')">
    <div class="product__rating">
      <SfRating :score="score" :max="max" />
      <a v-if="!!reviews" href="#" class="product__count">
        ({{ reviews.length }})
      </a>
    </div>
    <SfButton class="sf-button--text">
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
.product {
  &__rating {
    display: flex;
    align-items: center;
  }

  &__count {
    color: var(--c-text);
    margin-left: var(--spacer-xs);
  }
}
</style>
