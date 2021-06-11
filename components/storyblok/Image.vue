<template>
  <div :class="cssClasses" :style="styles">
    <SfImage
      :src="srcSet"
      :alt="item.alt_tag"
      :picture-breakpoint="768"
    />
    <p v-if="item.show_caption">
      {{ item.title_tag }}
    </p>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { SfImage } from '@storefront-ui/vue';

interface SrcSetValue {
  desktop?: { url: string },
  mobile?: { url: string }
}

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
    }
  }
})
</script>
