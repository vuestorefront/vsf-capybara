<template>
  <div
    :class="cssClasses"
    :style="styles"
    class="storyblok-image"
  >
    <CoolLightBox
      :items="getItems()"
      :index="lightboxIndexValue"
      @close="lightboxIndexValue = null"
    />

    <SfImage
      class="_image"
      :src="itemData.image.filename"
      :mobile-src="itemData.mobile_image.filename"
      :alt="itemData.alt_tag"
      :title="itemData.title_tag"
      @click="launchLightbox"
      :width="itemData.width"
    />
  </div>
</template>

<script lang="ts">
import { isServer } from '@vue-storefront/core/helpers';
import CoolLightBox from 'vue-cool-lightbox';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';

import { Blok } from 'src/modules/vsf-storyblok-module/components';

import SfImage from './BaseImage.vue';
import ImageData from './interfaces/image-data.interface';
import LightboxItemValue from './interfaces/lightbox-item-value.interface';

const SCREEN_WIDTH_BREAKPOINT = 768;

export default Blok.extend({
  name: 'StoryblokImage',
  components: {
    SfImage,
    CoolLightBox
  },
  data () {
    return {
      lightboxIndexValue: null as number | null
    }
  },
  computed: {
    itemData (): ImageData {
      return this.item as ImageData;
    },
    extraStyles (): Record<string, string> {
      const styles: Record<string, string> = {};

      if (this.itemData.has_lightbox) {
        styles['cursor'] = 'pointer';
      }

      return styles;
    }
  },
  methods: {
    getItems (): LightboxItemValue[] {
      const result: LightboxItemValue[] = [
        {
          src: this.itemData.image.filename,
          title: this.itemData.title_tag ? this.itemData.title_tag : undefined
        }
      ];

      if (isServer) {
        return result;
      }

      if (window.innerWidth >= SCREEN_WIDTH_BREAKPOINT || !this.itemData.mobile_image.filename) {
        return result;
      }

      return [{
        src: this.itemData.mobile_image.filename,
        title: this.itemData.title_tag ? this.itemData.title_tag : undefined
      }];
    },
    launchLightbox (): void {
      if (!this.itemData.has_lightbox) {
        return;
      }

      this.lightboxIndexValue = 0;
    }
  }
})
</script>

<style lang="scss">
.storyblok-image {
  text-align: center;
  font-size: 0;
}
</style>
