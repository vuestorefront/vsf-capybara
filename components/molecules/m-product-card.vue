<template>
  <div class="m-product-card">
    <div v-if="discountPercentage" class="card__discount">
      {{ discountPercentage }}
    </div>
    <SfProductCard
      :title="product.title"
      :image="product.image"
      :regular-price="product.price.regular"
      :special-price="product.price.special"
      :max-rating="product.rating.max"
      :score-rating="product.rating.score"
      :link="product.link"
      :link-tag="linkTag"
      :wishlist-icon="wishlistIcon"
      :image-height="imageHeight"
      :image-width="imageWidth"
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
  },
  computed: {
    discountPercentage () {
      console.log(this.product);
      if (!this.product.price.special || this.product.price.regular === this.product.price.special) {
        return 0;
      }

      // todo temporary
      const specialPrice = Number.parseFloat(this.product.price.special.replace('$', ''));
      const regularPrice = Number.parseFloat(this.product.price.regular.replace('$', ''));

      return Math.round((1 - specialPrice / regularPrice) * 100);
    }
  }
}
</script>

<style lang="scss" scoped>
    .m-product-card {
        position: relative;

        .card__discount {
            position: absolute;
            box-sizing: border-box;
            right: 10%;
            top: 6%;
            height: 66px;
            width: 66px;
            z-index: 5;
            background: #fff;
            color: var(--_c-light-primary);
            border: 2px solid var(--_c-light-primary);
            border-radius: 33px;
            font-weight: 800;
            line-height: 62px;
            text-align: center;
        }
    }
</style>
