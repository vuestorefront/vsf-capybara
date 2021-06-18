<template>
  <div
    class="storyblok-driver"
    :class="cssClasses"
    :style="styles"
  >
    <a
      class="_link"
      :target="linkTarget"
      :href="link"
    >
      <div class="_image-wrapper">
        <div class="_placeholder" />

        <SfImage
          class="_image"
          :src="srcSet"
          :alt="itemData.alt_tag"
          :title="itemData.title_tag"
          :picture-breakpoint="768"
          @load.capture="onLoad"
        />
      </div>

      <span class="_driver-text" v-if="itemData.link_text">
        {{ itemData.link_text }}
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { SfImage } from '@storefront-ui/vue';

import SrcSetValue from './interfaces/src-set-value.interface';
import DriverData from './interfaces/driver-data.interface';
import generatePlaceholderStyles from './generate-placeholder-styles';
import getUrlFromLink from './get-url-from-link';

export default Blok.extend({
  name: 'StoryblokDriver',
  components: {
    SfImage
  },
  data () {
    return {
      isLoaded: false
    }
  },
  computed: {
    itemData (): DriverData {
      return this.item as DriverData;
    },
    extraCssClasses (): string[] {
      return !this.isLoaded ? ['-loading'] : [];
    },
    extraStyles (): Record<string, string> {
      return generatePlaceholderStyles(
        this.itemData.image.filename,
        this.itemData.mobile_image.filename,
        'driver-image-height'
      );
    },
    link (): string {
      return getUrlFromLink(this.itemData.link_url);
    },
    linkTarget (): string {
      return this.itemData.target_blank ? '_blank'
        : '_self';
    },
    srcSet (): SrcSetValue | string | undefined {
      if (!this.itemData.image.filename) {
        return undefined
      }

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
    onLoad (): void{
      this.isLoaded = true;
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.storyblok-driver {

  ._link {
    display: block;
    text-decoration: none;
    position: relative;
  }

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

  &.-loading {
    ._image-wrapper {
      ._placeholder {
        background-color: #fafafa;
      }
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
