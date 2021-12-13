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
      :initial-back-design="backDesign"
      :initial-front-design="frontDesign"
      @back-design-selected="onBackDesignSelected"
      @front-design-selected="onFrontDesignSelected"
      v-if="getCurrentProduct"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import config from 'config';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import store from '@vue-storefront/core/store'
import Product from 'core/modules/catalog/types/Product';

import OPhrasePillowProductOrderForm from 'theme/components/organisms/o-phrase-pillow-product-order-form.vue';

const loadProduct = async () => {
  const product = await store.dispatch('product/loadProduct', {
    parentSku: 'petsiesPhrasePillow_bundle',
    childSku: null
  });

  await Promise.all([
    store.dispatch('budsies/loadProductBodyparts', { productId: product.id }),
    store.dispatch('budsies/loadProductRushAddons', {
      productId: product.id
    })
  ]);

  const loadBreadcrumbsPromise = store.dispatch(
    'product/loadProductBreadcrumbs',
    { product }
  );

  if (isServer) await loadBreadcrumbsPromise;
  catalogHooksExecutors.productPageVisited(product);
}

export default Vue.extend({
  name: 'PhrasePillowProduct',
  props: {
    backDesign: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    frontDesign: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  components: {
    OPhrasePillowProductOrderForm
  },
  computed: {
    getCurrentProduct (): Product | null {
      return this.$store.getters['product/getCurrentProduct'];
    },
    svgPath (): string {
      return (
        config.images.baseUrl + '/150/150/resize/phrase_pillow/svg-templates'
      );
    },
    imageUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    }
  },
  methods: {
    onBackDesignSelected (value?: string): void {
      if (value === this.backDesign) {
        return;
      }
      this.$router.push({ query: { ...this.$route.query, back_design: value } });
    },
    onFrontDesignSelected (value?: string): void {
      if (value === this.frontDesign || !value) {
        return;
      }

      this.$router.push({ params: { parentSku: value } });
    }
  },
  async serverPrefetch (): Promise<void> {
    if (this.$ssrContext) this.$ssrContext.output.cacheTags.add('product');

    return loadProduct();
  },
  async beforeRouteEnter (to, from, next): Promise<void> {
    if (isServer) next();

    if (from.name === 'pillowSideDesign-product') {
      next();
      return;
    }

    await loadProduct();
    next();
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
