<template>
  <div
    class="sf-image"
    :class="{ 'sf-image--no-size': !wrapperStyle }"
    :style="wrapperStyle"
    v-on="$listeners"
    @mouseover="overlay = true"
    @mouseleave="overlay = false"
  >
    <template v-if="typeof source === 'string'">
      <img
        v-if="show"
        ref="image"
        :src="source"
        :alt="alt"
        :width="width"
        :height="height"
      >
    </template>
    <template v-else>
      <picture>
        <source
          :srcset="source.webp.url"
          type="image/webp"
        >
        <source
          :srcset="source.fallback.url"
          type="image/jpeg"
        >
        <img
          v-if="show"
          ref="image"
          :src="source.fallback.url"
          :alt="alt"
          :width="width"
          :height="height"
        >
      </picture>
    </template>
    <transition name="fade">
      <div v-if="showOverlay" class="sf-image__overlay">
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
import {
  SfImage
} from '@storefront-ui/vue';

export default {
  name: 'APicture',
  mixins: [SfImage],
  props: {
    src: {
      type: [String, Object],
      default: () => ({ webp: { url: '' }, fallback: { url: '' } })
    }
  },
  computed: {
    source () {
      let src = this.src || '';
      if (typeof src === 'object') {
        if (!src.webp || !src.fallback) {
          const object = src.webp || src.fallback || { url: '' };
          src = object.url;
        }
      }
      return src;
    }
  }
}
</script>
