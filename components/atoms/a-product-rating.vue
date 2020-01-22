<template>
  <div class="a-product-rating">
    <SfRating :score="score" :max="max" @click="$emit('click:stars')" />
    <ATextAction :text="text" class="a-product-rating__action" @click="$emit('click:text')">
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
@import "~@storefront-ui/vue/styles";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.a-product-rating {
  display: flex;
  margin-top: $spacer-big / 2;
  @include for-desktop {
    margin-left: auto;
  }
  &__action {
    margin: 0;
    ::v-deep .sf-action {
      line-height: 1;
      padding-bottom: 5px;
    }
  }
  ::v-deep .sf-rating {
    cursor: pointer;
  }
}
</style>
