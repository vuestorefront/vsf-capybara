<template>
  <div class="sf-buttons" :style="styles" :class="cssClasses">
    <span v-for="button in buttons" :key="button._uid" class="_button-item">
      <SfButton
        :link="button.link_url.url"
        :class="buttonClass(button)"
        @click="openLink(button)"
      >
        {{ button.link_text }}
      </SfButton>
    </span>
  </div>
</template>

<script lang="ts">
import { SfButton } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { Blok } from 'src/modules/vsf-storyblok-module/components'

import ButtonItem from './interfaces/button-item-data.interface';

export default Blok.extend({
  name: 'Button',
  components: {
    SfButton
  },
  computed: {
    buttons (): ButtonItem[] {
      return this.item.button_items;
    }
  },
  methods: {
    openLink (button: ButtonItem): void {
      const url = button.link_url.cached_url || button.link_url.url;

      const route = this.$router.resolve({
        path: localizedRoute(url)
      });

      if (button.target_blank) {
        window.open(route.href, '_blank');
        return;
      }

      this.$router.push(route.location);
    },
    buttonClass (button: ButtonItem): string[] {
      const result: string [] = [];

      if (button.is_primary) {
        result.push('color-secondary');
      }

      return result;
    }
  }
})

</script>

<style lang="scss" scoped>
.sf-buttons {
  display: inline-block;

  ._button-item {
    margin-right: 1em;

    .sf-button {
      display: inline-block;
    }
  }
}
</style>
