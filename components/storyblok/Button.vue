<template>
  <div :style="styles">
    <SfButton
      :link="item.link_url.url"
      :class="cssClasses"
      @click="openLink"
    >
      {{ item.link_text }}
    </SfButton>
  </div>
</template>

<script lang="ts">
import { SfButton } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  name: 'Button',
  components: {
    SfButton
  },
  computed: {
    shouldOpenInNewWindow (): boolean {
      return !!this.item.target_blank;
    },
    extraCssClasses (): string[] {
      const result: string [] = [];

      if (!this.item.is_primary) {
        result.push('color-secondary');
      }

      return result;
    }
  },
  methods: {
    openLink (): void {
      const route = this.$router.resolve({
        path: localizedRoute(this.item.link_url.url)
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

<style scoped>
.sf-button {
  display: inline-block;
}
</style>
