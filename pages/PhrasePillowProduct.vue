<template>
  <div
    id="phrase-pillow-product"
    itemscope
    itemtype="http://schema.org/Product"
  >
    <OPhrasePillowProductOrderForm
      :product="getCurrentProduct"
      :image-upload-url="imageUploadUrl"
      :svg-path="svgPath"
      :initial-front-design="initialFrontDesign"
      v-if="getCurrentProduct"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import config from 'config';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { PRODUCT_UNSET_CURRENT } from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import Product from 'core/modules/catalog/types/Product';

import OPhrasePillowProductOrderForm from 'theme/components/organisms/o-phrase-pillow-product-order-form.vue';

const phrasePillowSku = 'petsiesPhrasePillow_bundle';

export default Vue.extend({
  name: 'PhrasePillowProduct',
  components: {
    OPhrasePillowProductOrderForm
  },
  data () {
    return {
      isRouterLeaving: false
    };
  },
  computed: {
    getCurrentProduct (): Product | null {
      const product = this.$store.getters['product/getCurrentProduct'];

      if (product?.sku !== phrasePillowSku) {
        return null;
      }

      return product;
    },
    svgPath (): string {
      return (
        config.images.baseUrl + '/150/150/resize/phrase_pillow/svg-templates'
      );
    },
    imageUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    },
    initialFrontDesign (): string | undefined {
      if (this.$route.params.parentSku) {
        return this.$route.params.parentSku;
      }

      return undefined;
    },
    getProductBySkuDictionary (): Record<string, Product> {
      return this.$store.getters['product/getProductBySkuDictionary'];
    }
  },
  async asyncData ({ store, route, context }): Promise<void> {
    if (context) context.output.cacheTags.add('product');

    const product = await store.dispatch('product/loadProduct',
      {
        parentSku: phrasePillowSku,
        setCurrent: false
      }
    );

    await Promise.all([
      store.dispatch('budsies/loadProductBodyparts', { productId: product.id }),
      store.dispatch('budsies/loadProductRushAddons', {
        productId: product.id
      }),
      store.dispatch('product/loadProductBreadcrumbs', { product })
    ]);

    if (isServer) {
      await store.dispatch('product/setCurrent', product);
    }

    catalogHooksExecutors.productPageVisited(product);
  },
  mounted () {
    this.setCurrentProduct();
  },
  beforeRouteLeave (to, from, next) {
    this.isRouterLeaving = true
    next();
  },
  beforeDestroy () {
    // Hot-reload workaround (old component instance is destroyed after new one has been created)
    // https://github.com/vuejs/vue/issues/6518
    if (this.isRouterLeaving) {
      this.$store.commit(`product/${PRODUCT_UNSET_CURRENT}`);
    }
  },
  methods: {
    async setCurrentProduct (): Promise<void> {
      if (this.getCurrentProduct) {
        return;
      }

      const product = this.getProductBySkuDictionary[phrasePillowSku];
      await this.$store.dispatch('product/setCurrent', product);
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
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#phrase-pillow-product {
  $medium-breakpoint: 641px;

  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  @media (min-width: $medium-breakpoint) {
    max-width: 1272px;
    margin: 0 auto;
    width: 100%;
    margin-top: 60px;
  }
}
</style>
