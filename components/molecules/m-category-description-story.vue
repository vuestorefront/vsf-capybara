<template>
  <div class="m-category-description-story">
    <Blok v-if="showStory" :item="story.content" class="_story" />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { Category } from '@vue-storefront/core/modules/catalog-next/types/Category';

import DescriptionStoryMixin from 'theme/mixins/description-story';

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
    Blok: components.block
  },
  computed: {
    storyFullSlug (): string {
      return `${storyParentFolderName}/${this.category.url_key}`;
    }
  }
})
</script>
