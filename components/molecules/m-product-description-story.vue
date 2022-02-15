<template>
  <div class="m-product-description-story" v-if="showStory || showFallback">
    <div v-if="showFallback" class="_fallback-container">
      <SfHeading :title="$t('Additional Details')" :level="3" />

      <div
        class="_fallback"
        v-html="fallbackDescription"
      />
    </div>

    <Blok v-if="showStory" :item="storyData.content" class="_story" />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import Product from '@vue-storefront/core/modules/catalog/types/Product';
import { StoryblokStories } from 'src/modules/vsf-storyblok-module/types/State';

import DescriptionStoryMixin from 'theme/mixins/description-story';

import { SfHeading } from '@storefront-ui/vue';
import { components } from 'src/modules/vsf-storyblok-module/components';

const storyParentFolderName = 'product-descriptions';

export default DescriptionStoryMixin.extend({
  name: 'MProductDescriptionStory',
  props: {
    product: {
      type: Object as PropType<Product>,
      required: true
    },
    backupProduct: {
      type: Object as PropType<Product | undefined>,
      default: undefined
    }
  },
  components: {
    Blok: components.block,
    SfHeading
  },
  computed: {
    storyData (): StoryblokStories | undefined {
      let story = this.$store.state.storyblok.stories[this.product.sku];

      console.log(story);

      if (!story?.content && this.backupProduct?.sku) {
        story = this.$store.state.storyblok.stories[this.backupProduct.sku];
      }

      return story;
    },
    fallbackDescription (): string | undefined {
      return this.product.description ? this.product.description : this.backupProduct?.description;
    }
  },
  async mounted () {
    if (this.story) {
      return;
    }

    await this.loadStory();
  },
  methods: {
    getStoryFullSlug (productSku: string): string {
      return `${storyParentFolderName}/${productSku}`;
    },
    async loadStory (): Promise<void> {
      await this.$store.dispatch(`storyblok/loadStory`, { fullSlug: this.getStoryFullSlug(this.product.sku) });

      if (this.backupProduct?.sku) {
        await this.$store.dispatch(`storyblok/loadStory`, { fullSlug: this.getStoryFullSlug(this.backupProduct.sku) });
      }
    }
  },
  watch: {
    'product.sku' (): void {
      this.loadStory();
    }
  }
})
</script>

<style lang="scss" scoped>
.m-product-description-story {
  ._fallback-container,
  ._fallback {
    padding-top: var(--spacer-base);
  }
}
</style>
