import Vue from 'vue';
import { StoryblokStories } from 'src/modules/vsf-storyblok-module/types/State';

export default Vue.extend({
  computed: {
    fallbackDescription (): string | undefined {
      return undefined;
    },
    storyData (): StoryblokStories | undefined {
      if (!this.storyFullSlug) {
        return;
      }

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
      return !!this.fallbackDescription &&
       (!this.story || !this.story.content) &&
        !!this.storyData &&
        !this.storyData.loading;
    },
    showStory (): boolean {
      return !!(this.story && this.story.content);
    },
    storyFullSlug (): string | undefined {
      return undefined;
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
      if (!this.storyFullSlug) {
        throw new Error('\'storyFullSlug\' property is not defined');
      }

      return this.$store.dispatch(`storyblok/loadStory`, {
        fullSlug: this.storyFullSlug
      });
    }
  }
});
