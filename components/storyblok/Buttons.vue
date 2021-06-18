<template>
  <div class="sf-buttons" :style="styles" :class="cssClasses">
    <span v-for="button in buttons" :key="button._uid" class="_button-item">
      <SfButton
        :link="getLink(button)"
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

import ButtonItemData from './interfaces/button-item-data.interface';
import ButtonsData from './interfaces/buttons-data.interface';
import getUrlFromLink from './get-url-from-link';

export default Blok.extend({
  name: 'Button',
  components: {
    SfButton
  },
  computed: {
    itemData (): ButtonsData {
      return this.item as ButtonsData;
    },
    buttons (): ButtonItemData[] {
      return this.itemData.button_items;
    }
  },
  methods: {
    getLink (button: ButtonItemData): string {
      return getUrlFromLink(button.link_url);
    },
    openLink (button: ButtonItemData): void {
      const url = getUrlFromLink(button.link_url);

      const route = this.$router.resolve({
        path: localizedRoute(url)
      });

      if (button.target_blank) {
        window.open(route.href, '_blank');
        return;
      }

      this.$router.push(route.location);
    },
    buttonClass (button: ButtonItemData): string[] {
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
