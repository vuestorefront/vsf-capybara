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
import { VueConstructor } from 'vue';
import { InjectType } from 'src/modules/shared';
import { SfButton } from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { mapGetters } from 'vuex'

import {
  Blok,
  getUrlFromLink,
  isUrlExternal
} from 'src/modules/vsf-storyblok-module'

import ButtonItemData from './interfaces/button-item-data.interface';

interface InjectedServices {
  window: Window
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokButton',
  components: {
    SfButton
  },
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    ...mapGetters({
      storeCodeFromHeader: 'storyblok/storeCode'
    }),
    itemData (): ButtonItemData {
      return this.item as ButtonItemData;
    },
    link (): string {
      return getUrlFromLink(this.itemData.link_url, this.storeCodeFromHeader);
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
      const url = this.link;

      const isExternalUrl = isUrlExternal(url);

      if (isExternalUrl) {
        this.window.open(url, '_blank');
        return;
      }

      const route = this.$router.resolve({
        path: localizedRoute(url)
      });

      if (this.shouldOpenInNewWindow) {
        this.window.open(route.href, '_blank');
        return;
      }

      this.$router.push(route.location);
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
  }

  &.-editor-preview-mode {
    ._button {
      pointer-events: none
    }
  }

  @include display-property-handling;
}
</style>
