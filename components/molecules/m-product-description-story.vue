<template>
  <div class="m-product-description-story" v-if="showStory">
    <Blok v-if="showStory" :item="story.content" class="_story" />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { StoryblokStories } from 'src/modules/vsf-storyblok-module/types/State';
import { components } from 'src/modules/vsf-storyblok-module/components';

import StoryMixin from 'theme/mixins/story';

const storyParentFolderName = 'product-descriptions';

export default StoryMixin.extend({
  name: 'MProductDescriptionStory',
  props: {
    productSku: {
      type: String,
      required: true
    },
    backupProductSku: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  components: {
    Blok: components.block
  },
  computed: {
    storyData (): StoryblokStories | undefined {
      let productStory = this.$store.state.storyblok.stories[this.getStoryFullSlug(this.productSku)];

      if (!productStory?.story?.content && this.backupProductSku) {
        productStory = this.$store.state.storyblok.stories[this.getStoryFullSlug(this.backupProductSku)];
      }

      return productStory;
    }
  },
  methods: {
    getStoryFullSlug (productSku: string): string {
      return `${storyParentFolderName}/${productSku}`;
    },
    async loadStory (): Promise<void> {
      const story = await this.$store.dispatch(`storyblok/loadStory`, { fullSlug: this.getStoryFullSlug(this.productSku) });

      if (!story?.content && this.backupProductSku) {
        await this.$store.dispatch(`storyblok/loadStory`, { fullSlug: this.getStoryFullSlug(this.backupProductSku) });
      }
    }
  },
  watch: {
    productSku (): void {
      this.loadStory();
    }
  }
})
</script>

<style lang="scss" scoped>
.m-product-description-story {

}
</style>
