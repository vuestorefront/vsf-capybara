<template>
  <div :class="cssClasses" :style="styles">
    <SfImage
      :src="srcSet"
      :alt="item.alt_tag"
      :picture-breakpoint="768"
      :style="imageStyles"
    />
    <p v-if="item.show_caption">
      {{ item.title_tag }}
    </p>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { SfImage } from '@storefront-ui/vue';

import SrcSetValue from './src-set-value.interface';

export default Blok.extend({
  name: 'StoryblokImage',
  components: {
    SfImage
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
  }
})
</script>
