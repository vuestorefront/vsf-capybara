<template>
  <BudsiesBaseImage
    :srcsets="sources"
    :width="width"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <slot />
  </BudsiesBaseImage>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex'
import { InjectKey } from 'vue/types/options';

import parseImageDimensions from './parse-image-dimensions';
import ComponentWidthCalculator, { SizeValue } from 'src/modules/vsf-storyblok-module/component-width-calculator.service';

import { BaseImage as BudsiesBaseImage, ImageSourceItem } from 'src/modules/budsies';

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

type InjectType<T> = Record<keyof T, InjectKey | { from?: InjectKey, default?: any }>;

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'StoryblokBaseImage',
  inheritAttrs: false,
  components: {
    BudsiesBaseImage
  },
  inject: {
    componentWidthCalculator: { default: undefined }
  } as unknown as InjectType<InjectedServices>,
  props: {
    src: {
      type: String,
      required: true
    },
    mobileSrc: {
      type: String,
      default: undefined
    },
    width: {
      type: [String, Number],
      default: null
    }
  },
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    sources (): ImageSourceItem[] {
      const result: ImageSourceItem[] = [];

      const breakpoints = this.componentWidthCalculator.getBreakpoints();
      const widths = this.componentWidthCalculator.getWidths();

      let fixedWidth: number | undefined;

      if (this.width) {
        const value = this.width.toString().replace(/\px$/, '');
        if (!isNaN(Number(value))) {
          fixedWidth = Number(value);
        }
      }

      let previousWidth = 0;
      let sourceItem: ImageSourceItem | undefined;

      for (const size in widths) {
        const sizeKey = size as SizeValue;

        let width = fixedWidth || widths[sizeKey];

        if (width === previousWidth && sourceItem) {
          sourceItem.breakpoint = breakpoints[sizeKey];
          continue;
        }

        previousWidth = width;

        let src = this.src;
        if (
          [SizeValue.xsmall, SizeValue.small].includes(sizeKey) &&
          this.mobileSrc
        ) {
          src = this.mobileSrc;
        }

        const filters = this.supportsWebp ? '/filters:format(webp)' : '';

        const [, resource] = src.split('//a.storyblok.com');
        let dimensions = parseImageDimensions(src);
        const ratio = dimensions.height / dimensions.width;

        sourceItem = {
          breakpoint: breakpoints[sizeKey],
          aspectRatio: 1 / ratio,
          srcset: []
        };

        for (const density of [1, 1.5, 2, 3]) {
          const adjustedWidth = Math.round(width * density / 10) * 10;
          const adjustedHeight = Math.round(adjustedWidth * ratio);

          let mod = '/fit-in';
          mod += `/${adjustedWidth}x${adjustedHeight}`;
          mod += filters;

          const resizedUrl = 'https://img2.storyblok.com' + mod + resource;

          sourceItem.srcset.push(`${resizedUrl}${density > 1 ? ' ' + density + 'x' : ''}`);
        }

        result.push(sourceItem);
      }

      return result;
    }
  }
});
</script>
<style lang="scss" scoped>
.storyblok-base-image {
  display: inline-block;
}
</style>
