<template>
  <div class="m-description-story">
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
import { components } from 'src/modules/vsf-storyblok-module/components';
import Vue from 'vue';

import { SfHeading } from '@storefront-ui/vue';
import { StoryblokStories } from 'src/modules/vsf-storyblok-module/types/State';

export default Vue.extend({
  name: 'MDescriptionStory',
  props: {
    fallbackDescription: {
      type: String,
      default: ''
    },
    storyFullSlug: {
      type: String,
      required: true
    }
  },
  components: {
    Blok: components.block,
    SfHeading
  },
  computed: {
    storyData (): StoryblokStories | undefined {
      return this.$store.state.storyblok.stories[this.storyFullSlug];
    },
    story (): Record<string, any> | undefined {
      if (!this.storyData) {
        return;
      }

      return this.storyData.story;
    },
    isStoryLoading (): boolean {
      return !!(this.storyData && this.storyData.loading);
    },
    showFallback (): boolean {
      return (!this.story || !this.story.content) && !!this.storyData && !this.storyData.loading;
    },
    showStory (): boolean {
      return !!(this.story && this.story.content);
    }
  },
  serverPrefetch () {
    return (this as any).loadStory();
  },
  async mounted () {
    if (this.story) {
      return;
    }

    await this.loadStory();
  },
  methods: {
    async loadStory (): Promise<Record<string, any>> {
      return this.$store.dispatch(`storyblok/loadStory`, {
        fullSlug: this.storyFullSlug
      });
    }
  }
});
</script>

<style lang="scss" scoped>
.m-description-story {
  ._fallback-container {
    padding-top: var(--spacer-base);
  }
}
</style>
