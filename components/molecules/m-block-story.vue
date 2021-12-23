<template>
  <div class="m-block-story">
    <Blok v-if="showStory" :item="story.content" class="_story" />
  </div>
</template>

<script lang="ts">
import StoryMixin from 'theme/mixins/story';

import { components } from 'src/modules/vsf-storyblok-module/components';

const blocksFolderName = 'blocks';

export default StoryMixin.extend({
  name: 'MBlockStory',
  props: {
    storySlug: {
      type: String,
      required: true
    }
  },
  components: {
    Blok: components.block
  },
  computed: {
    storyFullSlug (): string {
      // const normalizedPath = this.category.url_path.replace('/', '_');
      return `${blocksFolderName}/${this.storySlug}`;
    }
  }
})
</script>

<style lang="scss" scoped>

</style>
