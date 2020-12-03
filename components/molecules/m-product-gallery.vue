<template>
  <div class="m-product-gallery">
    <SfImage
      v-if="!isOnline"
      :src="offlineImage"
    />
    <div v-if="config.products.gallery.mergeConfigurableChildren">
      <SfGallery
        ref="gallery"
        :images="gallery"
      />
    </div>
    <div v-else :key="currentIndex">
      <SfGallery
        ref="gallery"
        :images="gallery"
      />
    </div>
  </div>
</template>

<script>
import config from 'config'
import isEqual from 'lodash-es/isEqual';
import { SfGallery, SfImage } from '@storefront-ui/vue';
import { onlineHelper } from '@vue-storefront/core/helpers';

export default {
  name: 'MProductGallery',
  components: {
    SfGallery,
    SfImage
  },
  data () {
    return {
      config
    }
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
    isOnline () {
      return onlineHelper.isOnline;
    },
    variantImage () {
      let variantImage = this.gallery.find(image => {
        let selectThis = true
        for (const [key, value] of Object.entries(this.configuration)) {
          if (
            typeof image.id !== 'undefined' &&
            typeof image.id[key] !== 'undefined' &&
            image.id[key] !== value.id
          ) {
            selectThis = false
          }
        }
        return selectThis || (image.id && image.id.color && String(image.id.color) === String(this.configuration.color.id))
      })

      if (!variantImage) {
        variantImage = this.gallery.find(image => {
          return typeof image.id.color !== 'undefined' &&
            typeof this.configuration.color !== 'undefined' &&
            String(image.id.color) === String(this.configuration.color.id)
        })
      }

      if (!variantImage) {
        variantImage = this.gallery[0];
      }

      if (!config.products.gallery.mergeConfigurableChildren) {
        variantImage = this.gallery[this.gallery.length - 1]
      }

      return variantImage;
    },
    currentIndex () {
      const index = this.gallery.findIndex(imageObject =>
        config.products.gallery.mergeConfigurableChildren ? isEqual(imageObject.id, this.variantImage.id) : isEqual(imageObject.desktop.url, this.variantImage.desktop.url)
      );

      return index === -1 ? 0 : index;
    }
  },
  watch: {
    currentIndex () {
      this.$refs.gallery.go(this.currentIndex)
    }
  }
};
</script>
<style lang="scss" scoped>
.m-product-gallery {
  flex: 1;
}
</style>
