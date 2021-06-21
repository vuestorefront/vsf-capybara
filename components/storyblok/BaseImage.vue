<template>
  <div
    class="storyblok-base-image sf-image"
    :class="{'-loading': !isLoaded}"
    :style="styles"
    v-on="$listeners"
  >
    <div class="_placeholder" />

    <div class="_image-wrapper">
      <picture>
        <source
          v-for="source of sources"
          :key="source.breakpoint"
          :srcset="source.srcset.join(', ')"
          :media="getMediaQuery(source.breakpoint)"
        >
        <img
          v-show="defaultSrc"
          ref="image"
          :src="defaultSrc"
          :srcset="defaultSrcSet"
          v-bind="$attrs"
          :width="width"
          :loading="lazy ? 'lazy' : 'eager'"
          @load="onLoad"
        >
      </picture>

      <div v-if="hasOverlay" class="sf-image__overlay">
        <slot />
      </div>

      <noscript inline-template>
        <img
        :src="defaultSrc"
        :srcset="defaultSrcSet"
        :alt="alt"
        class="sf-image sf-image-loaded"
        v-bind="$attrs"
        :width="width"
        />
      </noscript>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import { mapGetters } from 'vuex'
import { InjectKey } from 'vue/types/options';

import generatePlaceholderStyles from './generate-placeholder-styles';
import parseImageDimensions from './parse-image-dimensions';
import ComponentWidthCalculator, { SizeValue } from 'src/modules/vsf-storyblok-module/component-width-calculator.service';

interface SourceItem {
  breakpoint: number,
  srcset: string[]
}

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

type InjectType<T> = Record<keyof T, InjectKey | { from?: InjectKey, default?: any }>;

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'SfImage',
  inheritAttrs: false,
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
    lazy: {
      type: Boolean,
      default: true
    },
    width: {
      type: [String, Number],
      default: null
    }
  },
  data () {
    return {
      isLoaded: false
    };
  },
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    sources (): SourceItem[] {
      const result: SourceItem[] = [];

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
      let sourceItem: SourceItem | undefined;

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

        sourceItem = {
          breakpoint: breakpoints[sizeKey],
          srcset: []
        };

        const [, resource] = src.split('//a.storyblok.com');
        let dimensions = parseImageDimensions(src);
        const ratio = dimensions.height / dimensions.width;

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
    },
    defaultSrcSet (): string[] {
      return this.sources.slice(-1)[0].srcset;
    },
    defaultSrc (): string {
      return this.defaultSrcSet[0];
    },
    styles (): Record<string, string> {
      const styles = generatePlaceholderStyles(
        this.src,
        this.mobileSrc,
        'image-block-height'
      );

      styles['--image-width'] = '100%';
      if (this.width) {
        styles['--image-width'] = this.width.toString();
      }

      return styles;
    },
    hasOverlay (): boolean {
      return !!this.$slots.default;
    }
  },
  methods: {
    getMediaQuery (breakpoint: number): string | undefined {
      return `(max-width: ${breakpoint}px)`;
    },
    onLoad (): void{
      this.isLoaded = true;
    }
  },
  mounted () {
  }
});
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/components/atoms/SfImage.scss";
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.storyblok-base-image {
  display: inline-block;
  position: relative;
  width: var(--image-width, 100%);

  ._image-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  ._placeholder {
    background-color: transparent;
    padding-top: var(--image-block-height-mobile, var(--image-block-height, 0));
  }

  picture {
   display: block;
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
