<template>
  <div
    class="sf-image"
    :class="{ 'sf-image--has-size': size }"
    :style="size"
    v-on="$listeners"
  >
    <picture>
      <source
        v-for="(srcset, breakpoint) of sources"
        :key="breakpoint"
        :srcset="srcset.join(', ')"
        :media="getMediaQuery(breakpoint)"
      >
      <img
        v-show="defaultSrc"
        ref="image"
        :src="defaultSrc"
        :srcset="defaultSrcSet"
        v-bind="$attrs"
        :width="width"
        :height="height"
        :loading="lazy ? 'lazy' : 'eager'"
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
      :height="height"
      />
    </noscript>
  </div>
</template>

<script lang="ts">
import ComponentWidthCalculator, { SizeValue } from 'src/modules/vsf-storyblok-module/component-width-calculator.service';
import Vue, { VueConstructor } from 'vue';
import { InjectKey } from 'vue/types/options';
import parseImageDimensions from './parse-image-dimensions';

export interface SrcSet {
  src: string,
  width: number
}

export interface SrcSets {
  [key: number]: SrcSet
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
    },
    height: {
      type: [String, Number],
      default: null
    },
    rootMargin: {
      type: String,
      default: '0px 0px 0px 0px'
    },
    threshold: {
      type: [String, Number],
      default: 0
    }
  },
  data () {
    return {
    };
  },
  computed: {
    sources (): Record<number, string[]> {
      const result: Record<number, string[]> = {};

      const breakpoints = this.componentWidthCalculator.getBreakpoints();
      const widths = this.componentWidthCalculator.getWidths();

      for (const size in widths) {
        const sizeKey = size as SizeValue;

        let src = this.src;
        if (
          [SizeValue.xsmall, SizeValue.small].includes(sizeKey) &&
          this.mobileSrc
        ) {
          src = this.mobileSrc;
        }

        let width = widths[sizeKey];

        if (this.width) {
          const value = this.width.toString().replace(/\px$/, '');
          if (!isNaN(Number(value))) {
            width = Number(value);
          }
        }

        result[breakpoints[sizeKey]] = [];

        const [, resource] = src.split('//a.storyblok.com');
        let dimensions = parseImageDimensions(src);
        const ratio = dimensions.height / dimensions.width;

        for (const density of [1, 1.5, 2, 3]) {
          const adjustedWidth = Math.round(width * density / 10) * 10;
          const adjustedHeight = Math.round(adjustedWidth * ratio);

          let mod = '';
          mod += `/${adjustedWidth}x${adjustedHeight}`;

          const resizedUrl = 'https://img2.storyblok.com' + mod + resource;

          result[breakpoints[sizeKey]].push(`${resizedUrl}${density > 1 ? ' ' + density + 'x' : ''}`);
        }
      }

      return result;
    },
    defaultSrcSet (): string[] {
      const maxBreakpoint = Math.max(...Object.keys(this.sources).map(i => Number(i)));

      return this.sources[maxBreakpoint];
    },
    defaultSrc (): string {
      return this.defaultSrcSet[0];
    },
    size (): Record<string, string | number> | string | number {
      return (
        this.width &&
        this.height && {
          '--_image-width': this.width,
          '--_image-height': this.height
        }
      );
    },
    hasOverlay () {
      return this.$slots.default;
    }
  },
  methods: {
    getMediaQuery (breakpoint: string): string | undefined {
      return `(max-width: ${breakpoint}px)`;
    }
  },
  mounted () {
  }
});
</script>
<style lang="scss">
@import "~@storefront-ui/shared/styles/components/atoms/SfImage.scss";

picture {
  display: block;
}
</style>
