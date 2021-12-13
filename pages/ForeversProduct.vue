<template>
  <div id="forevers-product" itemscope itemtype="http://schema.org/Product">
    <o-forevers-creation-wizard
      :artwork-upload-url="artworkUploadUrl"
      :existing-plushie-id="existingPlushieId"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import config from 'config';
import { htmlDecode } from '@vue-storefront/core/filters';
import Product from 'core/modules/catalog/types/Product';

import OForeversCreationWizard from 'theme/components/organisms/o-forevers-creation-wizard.vue';

export default Vue.extend({
  name: 'ForeversProduct',
  components: {
    OForeversCreationWizard
  },
  data () {
    return {
    };
  },
  computed: {
    getCurrentProduct (): Product | null {
      return this.$store.getters['product/getCurrentProduct'];
    },
    artworkUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    },
    existingPlushieId (): string {
      return this.$route.query?.id;
    }
  },
  async asyncData ({ store, route, context }): Promise<void> {
  },
  metaInfo () {
    return {
      title: htmlDecode(
        this.getCurrentProduct?.meta_title || this.getCurrentProduct?.name
      ),
      meta: this.getCurrentProduct?.meta_description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: htmlDecode(this.getCurrentProduct?.meta_description)
          }
        ]
        : []
    };
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#forevers-product {
  padding: var(--spacer-lg) 0 0;
  box-sizing: border-box;

  @media (min-width: $tablet-min) {
    padding: var(--spacer-lg) 1rem 0;
  }

  @include for-desktop {
    width: 100%;
  }
}

</style>
