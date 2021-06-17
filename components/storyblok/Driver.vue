<template>
  <a
    class="storyblok-driver"
    :class="cssClasses"
    :style="styles"
    :target="linkTarget"
    :href="link"
  >
    <div class="_image-wrapper">
      <div class="_placeholder" />

      <SfImage
        class="_image"
        :src="srcSet"
        :alt="item.alt_tag"
        :picture-breakpoint="768"
      />
    </div>

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
import generatePlaceholderStyles from './generate-placeholder-styles';

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
    extraStyles (): Record<string, string> {
      return generatePlaceholderStyles(
        this.item.image.filename,
        this.item.mobile_image.filename,
        'driver-image-height'
      );
    },
    link (): string {
      return this.item.link_url.url;
    },
    linkTarget (): string {
      return this.item.target_blank ? '_blank'
        : '_self';
    },
    srcSet (): SrcSetValue | string | undefined {
      if (!this.item.image.filename) {
        return undefined
      }

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
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.storyblok-driver {
  display: block;
  text-decoration: none;
  position: relative;

  ._image-wrapper {
    position: relative;

    ._image {
      --image-width: 100%;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }

    ._placeholder {
      background-color: #fafafa;
      padding-top: var(--driver-image-height-mobile, var(--driver-image-height, 0));
    }
  }

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

  @media (min-width: $tablet-min) {
    ._image-wrapper {
      ._placeholder {
        padding-top: var(--driver-image-height, 0);
      }
    }
  }
}
</style>
