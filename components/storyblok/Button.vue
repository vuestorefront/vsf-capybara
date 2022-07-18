<template>
  <div :style="styles" class="storyblok-button">
    <sb-router-link
      class="_button sf-button"
      :class="cssClasses"
      :link="itemData.link_url"
      :is-new-window="shouldOpenInNewWindow"
    >
      {{ itemData.link_text }}
    </sb-router-link>
  </div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import { InjectType } from 'src/modules/shared';

import {
  Blok
} from 'src/modules/vsf-storyblok-module'

import ButtonItemData from './interfaces/button-item-data.interface';

interface InjectedServices {
  window: Window
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokButton',
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
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
  }
})

</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.storyblok-button {
  --button-wrap: normal;

  ._button {
    display: inline-block;

    &:hover {
      --c-link-hover: var(--button-color, var(--c-light-variant));
    }
  }

  &.-editor-preview-mode {
    ._button {
      pointer-events: none
    }
  }

  @include display-property-handling;
}
</style>
