<template>
  <div class="m-category-description-story">
    <div v-if="showFallback" class="_fallback-container">
      <SfHeading :title="$t('Additional Details')" :level="3" />

      <div
        class="_fallback"
        v-html="fallbackDescription"
      />
    </div>

    <Blok v-if="showStory" :item="story.content" class="_story" />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category';

import DescriptionStoryMixin from 'theme/mixins/description-story';

import { SfHeading } from '@storefront-ui/vue';
import { components } from 'src/modules/vsf-storyblok-module/components';

const storyParentFolderName = 'category-descriptions';

export default DescriptionStoryMixin.extend({
  name: 'MCategoryDescriptionStory',
  props: {
    category: {
      type: Object as PropType<Category>,
      required: true
    }
  },
  components: {
    Blok: components.block,
    SfHeading
  },
  computed: {
    fallbackDescription (): string | undefined {
      return this.category.description;
    },
    storyFullSlug (): string | undefined {
      if (!this.category.url_path) {
        return undefined;
      }

      const normalizedPath = this.category.url_path.replace('/', '_');
      return `${storyParentFolderName}/${normalizedPath}`;
    }
  },
  watch: {
    'category.url_path' (value?: string): void {
      if (!value) {
        return;
      }

      this.loadStory();
    }
  }
})
</script>

<style lang="scss" scoped>
.m-category-description-story {
  ._fallback-container,
  ._fallback {
    padding-top: var(--spacer-base);
  }
}
</style>
