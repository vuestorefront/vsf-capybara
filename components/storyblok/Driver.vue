<template>
  <div
    class="storyblok-driver"
    :class="cssClasses"
    :style="styles"
  >
    <sb-router-link
      class="_link"
      :link="itemData.link_url"
      :is-new-window="itemData.target_blank"
    >
      <BaseImage
        class="_image"
        :srcsets="imageSources"
        :alt="itemData.alt_tag"
        :title="itemData.title_tag"
      />

      <span class="_driver-text" v-if="itemData.link_text">
        {{ itemData.link_text }}
      </span>
    </sb-router-link>
  </div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';

import { InjectType } from 'src/modules/shared';
import {
  Blok,
  ComponentWidthCalculator
} from 'src/modules/vsf-storyblok-module';

import { BaseImage, ImageSourceItem } from 'src/modules/budsies';

import generateBreakpointsSpecs from './generate-breakpoints-specs';
import generateImageSourcesList from './generate-image-sources-list';
import DriverData from './interfaces/driver-data.interface';

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokDriver',
  components: {
    BaseImage
  },
  inject: {
    componentWidthCalculator: { }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    itemData (): DriverData {
      return this.item as DriverData;
    },
    extraCssClasses (): string[] {
      const result: string [] = [];

      if (this.itemData.zoom_effect) {
        result.push('-zoom-effect');
      }

      return result;
    },
    imageSources (): ImageSourceItem[] {
      if (!this.itemData.image.filename) {
        return [];
      };

      const breakpointsSpecs = generateBreakpointsSpecs(
        this.itemData.image.filename,
        this.componentWidthCalculator,
        this.itemData.mobile_image.filename
      )

      return generateImageSourcesList(
        breakpointsSpecs,
        this.supportsWebp
      )
    }
  },
  methods: {
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

$color-transition-overlay-bg: rgba(0, 0, 0, 0.3);
$transition-zoom-in-scale: 1.25;
$transition-zoom-in-time: 0.5s;

.storyblok-driver {
  ._link {
    display: block;
    text-decoration: none;
    position: relative;
  }

  ._driver-text {
    position: absolute;
    display: block;
    bottom: 0;
    box-sizing: border-box;
    left: 0;
    right: 0;
    padding: 1em;
    background: #000;
    background: $color-transition-overlay-bg;
    text-align: center;
    color: #fff;
  }

  ._image {
    display: block;
  }

  &.-zoom-effect {
    overflow: hidden;
    position: relative;
    transition: opacity $transition-zoom-in-time ease;

    &::after {
      background: $color-transition-overlay-bg;
      content: "\A";
      height: 100%;
      left: 0;
      opacity: 0;
      position: absolute;
      top: 0;
      transition: opacity $transition-zoom-in-time ease;
      width: 100%;
      z-index: 1;
    }

    ._driver-text {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.4em;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }

    ._image {
      transition: transform $transition-zoom-in-time ease;
    }

    &:hover {
      &::after {
        opacity: 1;
      }

      ._image {
        transform: scale($transition-zoom-in-scale);
      }
    }
  }

  &:hover {
    ._driver-text {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  &.-editor-preview-mode {
    ._link {
      pointer-events: none
    }
  }

  @media (min-width: $tablet-min) {
    &.-zoom-effect {
      ._driver-text {
        background-color: transparent;
        display: none;
        font-size: 2em;
      }

      &:hover {
        ._driver-text {
          display: flex;
        }
      }
    }
  }

  @include display-property-handling;
}
</style>
