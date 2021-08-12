<template>
  <div class="o-product-card">
    <SfProductCard
      :title="product.title"
      :image="product.image"
      :regular-price="product.price.regular"
      :special-price="product.price.special"
      :link="product.link"
      :link-tag="linkTag"
      :wishlist-icon="wishlistIcon"
      :image-height="imageHeight"
      :image-width="imageWidth"
      :badge-label="product.discount"
    />
  </div>
</template>

<script>
import { SfProductCard } from '@storefront-ui/vue';

export default {
  name: 'MProductCard',
  components: {
    SfProductCard
  },
  props: {
    imageWidth: {
      type: [String, Number],
      default: 216
    },
    imageHeight: {
      type: [String, Number],
      default: 326
    },
    product: {
      type: Object,
      required: true
    },
    linkTag: {
      type: String,
      default: undefined
    },
    wishlistIcon: {
      type: [String, Array, Boolean],
      default: 'heart'
    }
  }
}
</script>

<style lang="scss" scoped>
    $size: 66px;
    $border-width: 2px;

    .o-product-card {
          --product-card-badge-left: calc(95% - #{$size});
          --product-card-badge-top: 5%;
          --badge-height: #{$size};
          --badge-width: #{$size};
          --badge-padding: 0;
          --badge-border: #{$border-width} solid var(--_c-light-primary);
          --badge-border-radius: #{$size / 2};
          --badge-font-weight: 800;
          --badge-background: #fff;
          --badge-font-size: 1rem;

        ::v-deep .sf-badge {
            color: var(--_c-light-primary);
            line-height: $size - $border-width * 2;
            pointer-events: none;
        }
    }
</style>
