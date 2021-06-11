<template>
  <a
    class="storyblok-driver"
    :class="cssClasses"
    :style="styles"
    :target="linkTarget"
    :href="link"
  >
    <SfImage
      :src="srcSet"
      :alt="item.alt_tag"
      :picture-breakpoint="768"
    />
    <p v-if="item.show_caption">
      {{ item.title_tag }}
    </p>
  </a>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { SfImage } from '@storefront-ui/vue';

interface SrcSetValue {
  desktop?: { url: string },
  mobile?: { url: string }
}

export default Blok.extend({
  name: 'StoryblokDriver',
  components: {
    SfImage
  },
  computed: {
    link (): string {
      return this.item.link_url.url;
    },
    linkTarget (): string {
      return this.item.target_blank ? '_blank'
        : '_self';
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
  }
})
</script>

<style lang="scss" scoped>
.storyblok-driver {
  display: block;
  text-decoration: none;
}
</style>
