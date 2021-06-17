<template>
  <div :class="cssClasses" :style="styles">
    <CoolLightBox
      :items="getItems()"
      :index="indexValue"
      @close="indexValue = null"
    />

    <SfImage
      :src="srcSet"
      :alt="item.alt_tag"
      :picture-breakpoint="SCREEN_WIDTH_BREAKPOINT"
      :style="imageStyles"
      @click="indexValue = 0"
    />
    <p v-if="item.show_caption">
      {{ item.title_tag }}
    </p>
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
      SCREEN_WIDTH_BREAKPOINT: SCREEN_WIDTH_BREAKPOINT,
      indexValue: null
    }
  },
  computed: {
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
    },
    imageStyles (): Record<string, string> {
      const result: Record<string, string> = {};

      if (this.item.height) {
        result['height'] = this.item.height;
      }

      if (this.item.width) {
        result['width'] = this.item.width;
      }

      return result;
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
    }
  }
})
</script>
