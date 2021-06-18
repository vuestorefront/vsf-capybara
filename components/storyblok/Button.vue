<template>
  <div :style="styles" class="storyblok-button">
    <SfButton
      class="_button"
      :link="itemData.link_url.url"
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

export default Blok.extend({
  name: 'Button',
  components: {
    SfButton
  },
  computed: {
    itemData (): ButtonItemData {
      return this.item as ButtonItemData;
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
      const route = this.$router.resolve({
        path: localizedRoute(this.itemData.link_url.url)
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
}
</style>
