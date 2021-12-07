<template>
  <div id="pillow-product" itemscope itemtype="http://schema.org/Product">
    <o-pillow-product-order-form
      :artwork-upload-url="artworkUploadUrl"
      :product="getCurrentProduct"
      :plushie-id="plushieId"
      @make-another="onMakeAnother"
      v-if="getCurrentProduct"
    />
  </div>
</template>

<script lang="ts">
import config from 'config';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { PRODUCT_HARD_RESET_CURRENT } from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import Product from 'core/modules/catalog/types/Product';

import OPillowProductOrderForm from '../components/organisms/o-pillow-product-order-form.vue';

export default {
  name: 'PillowProduct',
  components: {
    OPillowProductOrderForm
  },
  data () {
    return {
      plushieId: undefined as number | undefined
    };
  },
  computed: {
    getCurrentProduct (): Product | null {
      return this.$store.getters['product/getCurrentProduct'];
    },
    artworkUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    }
  },
  async mounted (): Promise<void> {
    // TODO check ID in URL and load plushie instead of create a new one

    this.plushieId = await this.createPlushie();
  },
  async asyncData ({ store, route, context }): Promise<void> {
    if (context) context.output.cacheTags.add('product')

    const product = await store.dispatch('product/loadProduct', {
      parentSku: 'customPillow_bundle',
      childSku: null
    });

    await Promise.all([
      store.dispatch('budsies/loadProductBodyparts', { productId: product.id }),
      store.dispatch('budsies/loadProductRushAddons', { productId: product.id })
    ]);

    const loadBreadcrumbsPromise = store.dispatch(
      'product/loadProductBreadcrumbs',
      { product }
    );

    if (isServer) await loadBreadcrumbsPromise;
    catalogHooksExecutors.productPageVisited(product);
  },
  beforeDestroy () {
    this.$store.commit(`product/${PRODUCT_HARD_RESET_CURRENT}`);
  },
  methods: {
    async onMakeAnother (): Promise<void> {
      this.plushieId = await this.createPlushie();
    },
    async createPlushie (): Promise<number> {
      if (!this.getCurrentProduct) {
        throw new Error('Current product is not set!');
      }

      const task = await this.$store.dispatch('budsies/createNewPlushie', { productId: this.getCurrentProduct.id });
      return task.result;
    }
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
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#pillow-product {
  box-sizing: border-box;
  padding: var(--spacer-lg) 1rem 0;

  @media (min-width: $tablet-min) {
    max-width: 1272px;
    width: 100%;
    margin: 0 auto;
  }
}

</style>
