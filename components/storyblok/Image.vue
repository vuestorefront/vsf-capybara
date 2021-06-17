<template>
  <div
    :class="cssClasses"
    :style="styles"
    class="storyblok-image"
  >
    <CoolLightBox
      :items="getItems()"
      :index="indexValue"
      @close="indexValue = null"
    />

    <div
      class="_image-wrapper"
    >
      <div class="_placeholder" />

      <SfImage
        class="_image"
        :src="srcSet"
        :alt="item.alt_tag"
        :title="item.title_tag"
        :picture-breakpoint="screenWidthBreakpoint"
        @load.capture="onLoad"
        @click="indexValue = 0"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
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
  props: {
    item: {
      type: Object as PropType<ImageData>,
      required: true
    }
  },
  data () {
    return {
      indexValue: null,
      isLoaded: false
    }
  },
  computed: {
    extraCssClasses (): string[] {
      return !this.isLoaded ? ['-loading'] : [];
    },
    extraStyles (): Record<string, string> {
      const styles = generatePlaceholderStyles(
        this.item.image.filename,
        this.item.mobile_image.filename,
        'image-block-height'
      );

      if (this.item.width) {
        styles['--image-width'] = this.item.width;
      }

      return styles;
    },
    screenWidthBreakpoint (): number {
      return SCREEN_WIDTH_BREAKPOINT;
    },
    srcSet (): SrcSetValue | string {
      if (!this.item.mobile_image.filename) {
        return this.item.image.filename;
      }

      const srcSet: SrcSetValue = {
        desktop: {
          url: this.item.image.filename
        },
        mobile: {
          url: this.item.mobile_image.filename
        }
      };

      return srcSet;
    }
  },
  methods: {
    getItems (): LightboxItemValue[] {
      if (!isServer) {
        if (window.innerWidth < SCREEN_WIDTH_BREAKPOINT && this.item.mobile_image.filename) {
          return [{
            src: this.item.mobile_image.filename,
            title: this.item.show_caption ? this.item.title_tag : undefined
          }];
        }
      }

      return [
        {
          src: this.item.image.filename,
          title: this.item.show_caption ? this.item.title_tag : undefined
        }
      ];
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
