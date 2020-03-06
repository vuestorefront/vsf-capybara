<template>
  <div class="a-product-rating">
    <SfRating :score="score" :max="max" @click="$emit('click:stars')" />
    <ATextAction :text="text" @click="$emit('click:text')">
      <slot />
    </ATextAction>
  </div>
</template>
<script>
import { SfRating } from '@storefront-ui/vue';
import ATextAction from 'theme/components/atoms/a-text-action';
export default {
  components: {
    SfRating,
    ATextAction
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
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.a-product-rating {
  display: flex;
  align-items: center;
  margin-top: var(--spacer-big) / 2;
  @include for-desktop {
    margin-left: auto;
  }
  ::v-deep .sf-rating {
    cursor: pointer;
  }
  ::v-deep .a-text-action {
    margin: 0;
  }
}
</style>
