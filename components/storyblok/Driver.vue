<template>
  <div
    class="storyblok-driver"
    :class="cssClasses"
    :style="styles"
  >
    <router-link
      class="_link"
      :to="link"
      :target="linkTarget"
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
    </router-link>
  </div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';

import { InjectType } from 'src/modules/shared';
import { ComponentWidthCalculator } from 'src/modules/vsf-storyblok-module';

import { BaseImage, ImageSourceItem } from 'src/modules/budsies';
import { Blok } from 'src/modules/vsf-storyblok-module/components';

import getUrlFromLink from './get-url-from-link';
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
    componentWidthCalculator: { default: undefined }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    itemData (): DriverData {
      return this.item as DriverData;
    },
    link (): string {
      return getUrlFromLink(this.itemData.link_url);
    },
    linkTarget (): string {
      return this.itemData.target_blank ? '_blank'
        : '_self';
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
