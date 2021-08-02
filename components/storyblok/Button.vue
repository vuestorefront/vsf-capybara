<template>
  <div :style="styles" class="storyblok-button">
    <SfButton
      class="_button"
      :link="link"
      :class="cssClasses"
      @click="openLink"
    >
      {{ itemData.link_text }}
    </SfButton>
  </div>
</template>

<script lang="ts">
import { SfButton } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

import { Blok } from 'src/modules/vsf-storyblok-module/components'
import ButtonItemData from './interfaces/button-item-data.interface';
import getUrlFromLink from './get-url-from-link';

export default Blok.extend({
  name: 'StoryblokButton',
  components: {
    SfButton
  },
  computed: {
    itemData (): ButtonItemData {
      return this.item as ButtonItemData;
    },
    link (): string {
      return getUrlFromLink(this.itemData.link_url);
    },
    shouldOpenInNewWindow (): boolean {
      return !!this.itemData.target_blank;
    },
    extraCssClasses (): string[] {
      const result: string [] = [];

      if (!this.itemData.is_primary) {
        result.push('color-secondary');
      }

      return result;
    }
  },
  methods: {
    openLink (): void {
      const url = getUrlFromLink(this.itemData.link_url);

      const isExternalUrl = url.startsWith('//') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('ftp://');

      if (isExternalUrl) {
        window.open(url, '_blank');
        return;
      }

      const route = this.$router.resolve({
        path: localizedRoute(url)
      });

      if (this.shouldOpenInNewWindow) {
        window.open(route.href, '_blank');
        return;
      }

      this.$router.push(route.location);
    }
  }
})

</script>

<style lang="scss" scoped>
.storyblok-button {
  ._button {
    display: inline-block;
  }

  &.-editor-preview-mode {
    ._button {
      pointer-events: none
    }
  }
}
</style>
