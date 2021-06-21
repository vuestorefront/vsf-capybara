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

      <BaseImage
        class="_image"
        :src="itemData.image.filename"
        :mobile-src="itemData.mobile_image.filename"
        :alt="itemData.alt_tag"
        :title="itemData.title_tag"
      />

      <span class="_driver-text" v-if="itemData.link_text">
        {{ itemData.link_text }}
      </span>
    </a>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';

import BaseImage from './BaseImage.vue';

import DriverData from './interfaces/driver-data.interface';
import getUrlFromLink from './get-url-from-link';

export default Blok.extend({
  name: 'StoryblokDriver',
  components: {
    BaseImage
  },
  computed: {
    itemData (): DriverData {
      return this.item as DriverData;
    },
    link (): string {
      return getUrlFromLink(this.itemData.link_url);
    },
    linkTarget (): string {
      return this.itemData.target_blank ? '_blank'
        : '_self';
    }
  },
  methods: {
  }
})
</script>

<style lang="scss" scoped>
.storyblok-driver {

  ._link {
    display: block;
    text-decoration: none;
    position: relative;
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
}
</style>
