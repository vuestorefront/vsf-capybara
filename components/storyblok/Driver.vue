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
    <span class="_driver-text" v-if="item.link_text">
      {{ item.link_text }}
    </span>
  </a>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { SfImage } from '@storefront-ui/vue';

import SrcSetValue from './interfaces/src-set-value.interface';
import DriverData from './interfaces/driver-data.interface';

export default Blok.extend({
  name: 'StoryblokDriver',
  components: {
    SfImage
  },
  props: {
    item: {
      type: Object as PropType<DriverData>,
      required: true
    }
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
  position: relative;

  ._driver-text {
    position: absolute;
    z-index: 10;
    display: block;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 15px;
    background: #000;
    background: rgba(0, 0, 0, 0.4);
    text-align: center;
    color: #fff;
  }

  &:hover {
    ._driver-text {
      background: rgba(0, 0, 0, 0.7);
    }
  }
}
</style>
