<template>
  <div class="m-product-short-info">
    <div class="product__header">
      <SfHeading
        :title="product.name | htmlDecode"
        :level="1"
        class="sf-heading--no-underline sf-heading--left"
      />
    </div>
    <div
      class="product__description desktop-only"
      v-html="product.short_description"
      v-if="product.short_description"
    />
    <div class="product__price">
      <AProductPrice
        v-if="product.type_id !== 'grouped'"
        :product="product"
        :custom-options="customOptions"
      />
    </div>
  </div>
</template>

<script>
import { SfHeading, SfIcon } from '@storefront-ui/vue';
import AProductPrice from 'theme/components/atoms/a-product-price';
export default {
  name: 'MProductShortInfo',
  components: {
    SfHeading,
    SfIcon,
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "~@storefront-ui/shared/styles/helpers/typography";

.product {
  &__header {
    display: flex;
    justify-content: space-between;

    ::v-deep .sf-heading__title {
      line-height: 1.2;
    }

    @include for-desktop {
      margin: 0 auto;
    }
  }
  &__price {
    margin: var(--spacer-xs) 0 var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__description {
    @include font(
      --product-description-font,
      var(--font-light),
      var(--font-base),
      1.6,
      var(--font-family-primary)
    );
  }
}

@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>
