<template>
  <div class="m-product-description-story">
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
import Product from '@vue-storefront/core/modules/catalog/types/Product';

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
    }
  },
  components: {
    Blok: components.block,
    SfHeading
  },
  computed: {
    fallbackDescription (): string | undefined {
      return this.product.description;
    },
    storyFullSlug (): string {
      return `${storyParentFolderName}/${this.product.sku}`;
    }
  }
})
</script>

<style lang="scss" scoped>
.m-product-description-story {
  ._fallback-container {
    padding-top: var(--spacer-base);
  }
}
</style>
