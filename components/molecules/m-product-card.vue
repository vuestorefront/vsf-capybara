<template>
  <div class="m-product-card">
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
    >
      <template #image="{image, title}">
        <template v-if="Array.isArray(image)">
          <SfImage
            v-for="(picture, key) in image.slice(0, 2)"
            :key="key"
            class="sf-product-card__picture"
            :src="picture"
            :alt="title"
            :width="imageWidth"
            :height="imageHeight"
          />
        </template>

        <SfImage
          v-else
          class="sf-product-card__image"
          :src="image"
          :alt="title"
          :width="imageWidth"
          :height="imageHeight"
        />

        <div v-if="product.discount" class="card__discount">
          {{ product.discount }}
        </div>
      </template>
    </SfProductCard>
  </div>
</template>

<script>
import { SfImage, SfProductCard } from '@storefront-ui/vue';

export default {
  name: 'MProductCard',
  components: {
    SfImage,
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

    .m-product-card {
        .card__discount {
            position: absolute;
            box-sizing: border-box;
            right: 5%;
            top: 5%;
            height: $size;
            width: $size;
            z-index: 5;
            background: #fff;
            color: var(--_c-light-primary);
            border: $border-width solid var(--_c-light-primary);
            border-radius: $size / 2;
            font-weight: 800;
            line-height: $size - $border-width * 2;
            text-align: center;
        }
    }
</style>
