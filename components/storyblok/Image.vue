<template>
  <div
    :class="cssClasses"
    :style="styles"
    class="storyblok-image"
  >
    <CoolLightBox
      :items="getLightboxItems()"
      :index="lightboxIndexValue"
      @close="lightboxIndexValue = null"
    />

    <BaseImage
      class="_image"
      :srcsets="imageSources"
      :alt="itemData.alt_tag"
      :title="itemData.title_tag"
      @click="launchLightbox"
      :width="itemData.width"
    />
  </div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import { isServer } from '@vue-storefront/core/helpers';
import CoolLightBox from 'vue-cool-lightbox';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';

import { InjectType } from 'src/modules/shared';
import { ComponentWidthCalculator } from 'src/modules/vsf-storyblok-module';
import { BaseImage, ImageSourceItem } from 'src/modules/budsies';
import { Blok } from 'src/modules/vsf-storyblok-module/components';

import ImageData from './interfaces/image-data.interface';
import LightboxItemValue from './interfaces/lightbox-item-value.interface';
import generateImageSourcesList from './generate-image-sources-list';

const SCREEN_WIDTH_BREAKPOINT = 768;

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokImage',
  components: {
    BaseImage,
    CoolLightBox
  },
  inject: {
    componentWidthCalculator: { default: undefined }
  } as unknown as InjectType<InjectedServices>,
  data () {
    return {
      lightboxIndexValue: null as number | null
    }
  },
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    itemData (): ImageData {
      return this.item as ImageData;
    },
    extraStyles (): Record<string, string> {
      const styles: Record<string, string> = {};

      if (this.itemData.has_lightbox) {
        styles['cursor'] = 'pointer';
      }

      return styles;
    },
    imageSources (): ImageSourceItem[] {
      if (!this.itemData.image.filename) {
        return [];
      };

      return generateImageSourcesList(
        this.itemData.image.filename,
        this.componentWidthCalculator,
        this.supportsWebp,
        this.itemData.mobile_image.filename,
        this.itemData.width
      )
    }
  },
  methods: {
    getLightboxItems (): LightboxItemValue[] {
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
