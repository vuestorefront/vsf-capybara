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

    <div
      class="_image-wrapper"
    >
      <div class="_placeholder" />

      <SfImage
        class="_image"
        :src="srcSet"
        :alt="itemData.alt_tag"
        :title="itemData.title_tag"
        :picture-breakpoint="screenWidthBreakpoint"
        @load.capture="onLoad"
        @click="launchLightbox"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { isServer } from '@vue-storefront/core/helpers';
import { SfImage } from '@storefront-ui/vue';
import CoolLightBox from 'vue-cool-lightbox';
import 'vue-cool-lightbox/dist/vue-cool-lightbox.min.css';

import { Blok } from 'src/modules/vsf-storyblok-module/components';
import SrcSetValue from './interfaces/src-set-value.interface';
import ImageData from './interfaces/image-data.interface';
import LightboxItemValue from './interfaces/lightbox-item-value.interface';
import generatePlaceholderStyles from './generate-placeholder-styles';

const SCREEN_WIDTH_BREAKPOINT = 768;

export default Blok.extend({
  name: 'StoryblokImage',
  components: {
    SfImage,
    CoolLightBox
  },
  data () {
    return {
      lightboxIndexValue: null as number | null,
      isLoaded: false
    }
  },
  computed: {
    itemData (): ImageData {
      return this.item as ImageData;
    },
    extraCssClasses (): string[] {
      return !this.isLoaded ? ['-loading'] : [];
    },
    extraStyles (): Record<string, string> {
      const styles = generatePlaceholderStyles(
        this.itemData.image.filename,
        this.itemData.mobile_image.filename,
        'image-block-height'
      );

      if (this.itemData.width) {
        styles['--image-width'] = this.itemData.width;
      }

      if (this.itemData.has_lightbox) {
        styles['cursor'] = 'pointer';
      }

      return styles;
    },
    screenWidthBreakpoint (): number {
      return SCREEN_WIDTH_BREAKPOINT;
    },
    srcSet (): SrcSetValue | string {
      if (!this.itemData.mobile_image.filename) {
        return this.itemData.image.filename;
      }

      const srcSet: SrcSetValue = {
        desktop: {
          url: this.itemData.image.filename
        },
        mobile: {
          url: this.itemData.mobile_image.filename
        }
      };

      return srcSet;
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
    },
    onLoad (): void{
      this.isLoaded = true;
    }
  }
})
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.storyblok-image {
  text-align: center;
  font-size: 0;

  ._image-wrapper {
    display: inline-block;
    position: relative;
    width: var(--image-width, 100%);
  }

  ._image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  ._placeholder {
    background-color: none;
    padding-top: var(--image-block-height-mobile, var(--image-block-height, 0));
  }

  &.-loading {
    ._placeholder {
      background-color: #fafafa;
    }
  }

  @media (min-width: $tablet-min) {
    ._placeholder {
      padding-top: var(--image-block-height, 0);
    }
  }
}
</style>
