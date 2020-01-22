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
      class="m-product-gallery__mobile mobile-only"
      :images="gallery"
      :current="currentIndex + 1"
      :slider-options="sliderOptions"
    />
  </div>
</template>
<script>
import { SfGallery, SfImage } from '@storefront-ui/vue';
import reduce from 'lodash-es/reduce';
import map from 'lodash-es/map';
import isEqual from 'lodash-es/isEqual';
import { onlineHelper } from '@vue-storefront/core/helpers';
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
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.m-product-gallery {
  flex: 1;
  &__mobile {
    $height-other: 240px;
    $height-iOS: 265px;

    height: calc(100vh - #{$height-other});
    @supports (-webkit-overflow-scrolling: touch) {
      height: calc(100vh - #{$height-iOS});
    }
    ::v-deep .glide {
      &,
      * {
        height: 100%;
      }
      &__slide {
        position: relative;
        overflow: hidden;
      }
      img {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        min-width: calc((375 / 490) * (100vh - #{$height-other}));
        @supports (-webkit-overflow-scrolling: touch) {
          min-width: calc((375 / 490) * (100vh - #{$height-iOS}));
        }
      }
    }
    ::v-deep .sf-gallery__stage {
      width: 100%;
    }
  }
}
</style>
