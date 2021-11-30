<template>
  <div class="m-product-description-story">
    <Blok v-if="showStory" :item="story.content" class="_story" />
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import Product from '@vue-storefront/core/modules/catalog/types/Product';

import DescriptionStoryMixin from 'theme/mixins/description-story';

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
    Blok: components.block
  },
  computed: {
    storyFullSlug (): string {
      return `${storyParentFolderName}/${this.product.sku}`;
    }
  }
})
</script>
