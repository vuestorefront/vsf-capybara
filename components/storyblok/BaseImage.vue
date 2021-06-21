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
import Vue, { PropType } from 'vue';
import parseImageDimensions from './parse-image-dimensions';

export interface SrcSet {
  src: string,
  width: number
}

export interface SrcSets {
  [key: number]: SrcSet
}

export default Vue.extend({
  name: 'SfImage',
  inheritAttrs: false,
  props: {
    srcsets: {
      type: Object as PropType<SrcSets>,
      required: true
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

      for (const breakpoint in this.srcsets) {
        const srcset = this.srcsets[breakpoint];

        result[breakpoint] = [];

        const [, resource] = srcset.src.split('//a.storyblok.com');
        let dimensions = parseImageDimensions(srcset.src);
        const ratio = dimensions.height / dimensions.width;

        for (const density of [1, 1.5, 2, 3]) {
          const width = Math.round(srcset.width * density / 10) * 10;
          const height = Math.round(width * ratio);

          let mod = '';
          mod += `/${width}x${height}`;

          const resizedUrl = 'https://img2.storyblok.com' + mod + resource;

          result[breakpoint].push(`${resizedUrl}${density > 1 ? ' ' + density + 'x' : ''}`);
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
