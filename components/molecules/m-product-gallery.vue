<template>
  <div class="m-product-gallery">
    <SfImage class="desktop-only" :src="variantImage" />
    <SfImage
      v-if="additionalImage"
      class="desktop-only"
      :src="additionalImage"
    />
    <SfGallery
      ref="imageGallery"
      class="mobile-only"
      :images="gallery"
      :current="currentIndex + 1"
      :slider-options="sliderOptions"
      :image-width="imageSize.width"
      :image-height="imageSize.height"
    />
  </div>
</template>
<script>
import { SfGallery, SfImage } from '@storefront-ui/vue';
import reduce from 'lodash-es/reduce';
import map from 'lodash-es/map';
import isEqual from 'lodash-es/isEqual';
import { onlineHelper } from '@vue-storefront/core/helpers';
import config from 'config'
export default {
  name: 'MProductGallery',
  components: {
    SfGallery,
    SfImage
  },
  props: {
    gallery: {
      type: Array,
      required: true
    },
    configuration: {
      type: Object,
      required: true
    },
    offlineImage: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  computed: {
    sliderOptions () {
      return {
        startAt: this.currentIndex,
        type: 'slider',
        autoplay: false,
        rewind: false,
        gap: 0
      };
    },
    variantImage () {
      let variantImage = this.gallery.find(
        imageObject =>
          isEqual(imageObject.id, this.option) ||
          (imageObject.id && imageObject.id.color === this.option.color)
      );

      if (!variantImage) {
        variantImage = this.gallery[0];
      }

      if (!this.isOnline) {
        variantImage = this.offlineImage;
      }

      return variantImage;
    },
    additionalImage () {
      const withoutVariantImage = this.gallery.filter(
        imageObject => !isEqual(this.variantImage.id, imageObject.id)
      );

      if (!this.isOnline) {
        return null;
      }

      return withoutVariantImage[0];
    },
    option () {
      return reduce(
        map(this.configuration, 'attribute_code'),
        (result, attribute) => {
          result[attribute] = this.configuration[attribute].id;
          return result;
        },
        {}
      );
    },
    isOnline () {
      return onlineHelper.isOnline;
    },
    currentIndex () {
      const index = this.gallery.findIndex(imageObject =>
        isEqual(imageObject.id, this.variantImage.id)
      );

      return index === -1 ? 0 : index;
    },
    imageSize () {
      const width = config.products.gallery.width;
      const height = config.products.gallery.height;
      return { width, height }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.m-product-gallery {
  flex: 1;
}
</style>
