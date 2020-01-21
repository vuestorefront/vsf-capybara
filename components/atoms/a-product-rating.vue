<template>
  <div class="a-product-rating">
    <SfRating :score="score" :max="max" />
    <ATextAction class="a-product-rating__action">
      <span class="a-product-rating__reviews desktop-only">
        {{ $t("Read all {review} review", { review: review }) }}
      </span>
      <span class="a-product-rating__reviews mobile-only">
        {{ `(${review})` }}
      </span>
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
    score: {
      type: Number,
      default: 0,
      reqiured: true
    },
    max: {
      type: Number,
      default: 0,
      reqiured: true
    },
    review: {
      type: Number,
      default: 0
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
  &__reviews {
    margin-left: 10px;
    font-size: 0.75rem;
  }
  &__action {
    margin: 0;
    ::v-deep .sf-action {
      line-height: 1;
      padding-bottom: 5px;
    }
  }
}
</style>
