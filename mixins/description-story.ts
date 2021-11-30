import Vue from 'vue';
import { StoryblokStories } from 'src/modules/vsf-storyblok-module/types/State';

export default Vue.extend({
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
    showStory (): boolean {
      return !!(this.story && this.story.content);
    },
    storyFullSlug (): string {
      throw new Error('\'storyFullSlug\' computed property not implemented yet');
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
