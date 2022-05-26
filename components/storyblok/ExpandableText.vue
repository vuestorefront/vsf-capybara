<template>
  <p ref="expandableTextBlock" class="expandable-text-block">
    {{ content }}
    <a
      href="javascript:void(0);"
      class="_link"
      @click.stop="toggleState"
      v-if="isExpandable"
    >read more</a>
    <a
      href="javascript:void(0);"
      class="_link"
      @click.stop="toggleState"
      v-if="isShrinkable"
    >show less</a>
  </p>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import { InjectType } from 'src/modules/shared';

import { Blok } from 'src/modules/vsf-storyblok-module/components'
import ExpandableTextData from './interfaces/expandable-text-data.interface';

interface InjectedServices {
  window: Window
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokExpandableText',
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  data () {
    return {
      fIsExpanded: false,
      fAuxiliaryOffset: 100
    };
  },
  computed: {
    itemData (): ExpandableTextData {
      return this.item as ExpandableTextData;
    },
    textLimit (): number {
      let limit = this.itemData.text_content.indexOf(' ', this.itemData.max_length - 1);

      if (limit === -1) {
        limit = this.itemData.text_content.length;
      }

      return limit;
    },
    shortText (): string {
      return this.itemData.text_content.substring(0, this.textLimit) + '...';
    },
    content: {
      get: function (): string {
        return this.fIsExpanded ? this.itemData.text_content : this.shortText;
      }
    },
    isExpandable: {
      get: function (): boolean {
        if (this.itemData.text_content.length <= this.textLimit) {
          return false;
        }
        return !this.fIsExpanded;
      }
    },
    isShrinkable: {
      get: function (): boolean {
        if (this.itemData.text_content.length <= this.textLimit) {
          return false;
        }
        return !!this.fIsExpanded;
      }
    }
  },
  methods: {
    toggleState (): void {
      this.fIsExpanded = !this.fIsExpanded;

      if (!this.fIsExpanded) {
        this.scrollPage();
      }
    },
    getRootBlock (): HTMLElement | undefined {
      return this.$refs['expandableTextBlock'] as HTMLElement;
    },
    scrollPage (): void {
      const textBlock = this.getRootBlock();

      if (textBlock === undefined) {
        return;
      }

      const windowScroll = window.scrollY;
      const textBlockTopPosition =
            textBlock.getBoundingClientRect().top + windowScroll;

      if (textBlockTopPosition < windowScroll) {
        this.window.scrollTo(0, textBlockTopPosition - this.fAuxiliaryOffset);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.expandable-text-block {
  ._link {
      margin-left: 0.5em;
  }

  @include display-property-handling;
}
</style>
