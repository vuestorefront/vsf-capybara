<template>
  <div id="printed-product" itemscope itemtype="http://schema.org/Product">
    <o-printed-product-order-form
      :artwork-upload-url="artworkUploadUrl"
      :product="getCurrentProduct"
      :selected-style="productDesign"
      @style-selected="onStyleSelected"
      v-if="getCurrentProduct"
    />
  </div>
</template>

<script lang="ts">
import { Route } from 'vue-router';
import { Store } from 'vuex';
import Vue, { PropType } from 'vue';
import config from 'config';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { PRODUCT_UNSET_CURRENT } from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import store from '@vue-storefront/core/store'

import Product from 'core/modules/catalog/types/Product';

import OPrintedProductOrderForm from 'theme/components/organisms/o-printed-product-order-form.vue';

const loadData = async (route: Route, store: Store<any>) => {
  const product = await store.dispatch('product/loadProduct', {
    parentSku: (route.matched[0].props as {default: {sku: string}}).default.sku,
    setCurrent: false
  });

  await store.dispatch('budsies/loadExtraPhotosAddons', {
    productId: product.id
  });

  const loadBreadcrumbsPromise = store.dispatch(
    'product/loadProductBreadcrumbs',
    { product }
  );

  if (isServer) await loadBreadcrumbsPromise;
  catalogHooksExecutors.productPageVisited(product);
}

export default Vue.extend({
  name: 'PrintedProduct',
  components: {
    OPrintedProductOrderForm
  },
  props: {
    sku: {
      type: String,
      required: true
    },
    productDesign: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  computed: {
    getCurrentProduct (): Product | null {
      const product = this.$store.getters['product/getCurrentProduct'];
      if (!product?.sku || product.sku !== this.sku) {
        return null;
      }

      return product;
    },
    artworkUploadUrl () {
      return config.images.fileuploaderUploadUrl;
    },
    getProductBySkuDictionary (): Record<string, Product> {
      return this.$store.getters['product/getProductBySkuDictionary'];
    }
  },
  async serverPrefetch () {
    if (this.$ssrContext) this.$ssrContext.output.cacheTags.add('product')

    await loadData(this.$route, this.$store);
    await (this as any).setCurrentProduct();
  },
  async mounted () {
    if (!this.getCurrentProduct) {
      await this.setCurrentProduct();
    }
  },
  beforeDestroy () {
    this.$store.commit(`product/${PRODUCT_UNSET_CURRENT}`);
  },
  async beforeRouteEnter (to, from, next) {
    if (isServer) {
      next();
      return;
    }

    if (!from) {
      next();
      return;
    }

    await loadData(to, store);
    next();
  },
  methods: {
    async setCurrentProduct (): Promise<void> {
      const product = this.getProductBySkuDictionary[this.sku];
      await this.$store.dispatch('product/setCurrent', product);
    },
    async loadData (): Promise<void> {
      const product = await this.$store.dispatch('product/loadProduct', {
        parentSku: this.sku,
        childSku: null
      });

      await this.$store.dispatch('budsies/loadExtraPhotosAddons', {
        productId: product.id
      });

      const loadBreadcrumbsPromise = this.$store.dispatch(
        'product/loadProductBreadcrumbs',
        { product }
      );

      if (isServer) await loadBreadcrumbsPromise;
      catalogHooksExecutors.productPageVisited(product);
    },
    onStyleSelected (value?: string): void {
      if (value === this.productDesign) {
        return;
      }

      this.$router.push({ query: { ...this.$route.query, product_design: value } });
    }
  },
  watch: {
    sku: async function () {
      await loadData(this.$route, this.$store);
      await this.setCurrentProduct();
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

#printed-product {
  box-sizing: border-box;
  padding: 0 1rem;

  ::v-deep {
    .product__colors button {
        border: 1px solid var(--c-light);
    }
  }

  @media (min-width: $tablet-min) {
    max-width: 1272px;
    width: 100%;
    margin: 0 auto;

    .o-printed-product-order-form {
      margin-top: var(--spacer-lg);
    }
  }
}

</style>
