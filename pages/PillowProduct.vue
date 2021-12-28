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
import { PropType } from 'vue';
import config from 'config';
import { htmlDecode } from '@vue-storefront/core/filters';
import { isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { PRODUCT_UNSET_CURRENT } from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import Product from 'core/modules/catalog/types/Product';

import OPillowProductOrderForm from '../components/organisms/o-pillow-product-order-form.vue';

const pillowSku = 'customPillow_bundle';

export default {
  name: 'PillowProduct',
  props: {
    plushieId: {
      type: Number as PropType<number | undefined>,
      default: undefined
    }
  },
  components: {
    OPillowProductOrderForm
  },
  data () {
    return {
      isRouterLeaving: false
    };
  },
  computed: {
    getCurrentProduct (): Product | null {
      const product = this.$store.getters['product/getCurrentProduct'];

      if (product?.sku !== pillowSku) {
        return null;
      }

      return product;
    },
    artworkUploadUrl (): string {
      return config.images.fileuploaderUploadUrl;
    },
    getProductBySkuDictionary (): Record<string, Product> {
      return this.$store.getters['product/getProductBySkuDictionary'];
    }
  },
  async mounted (): Promise<void> {
    await this.setCurrentProduct();

    if (this.plushieId) {
      const task = await this.$store.dispatch(
        'budsies/fetchPlushieById',
        { plushieId: this.plushieId }
      );

      // TODO try to find existing cart item with corresponding plushie id for cart item editing purpose.
      if (task.code === 200 && task.result.status_id === 1) {
        return;
      }
    }

    await this.createPlushie();
  },
  async asyncData ({ store, route, context }): Promise<void> {
    if (context) context.output.cacheTags.add('product')

    const product = await store.dispatch('product/loadProduct',
      {
        parentSku: pillowSku,
        setCurrent: false
      }
    );

    await Promise.all([
      store.dispatch('budsies/loadProductBodyparts', { productId: product.id }),
      store.dispatch('budsies/loadProductRushAddons', { productId: product.id })
    ]);

    if (isServer) {
      await store.dispatch('product/setCurrent', product);
    }

    catalogHooksExecutors.productPageVisited(product);
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
    async onMakeAnother (): Promise<void> {
      await this.createPlushie();
    },
    async createPlushie (): Promise<void> {
      if (!this.getCurrentProduct) {
        throw new Error('Current product is not set!');
      }

      const task = await this.$store.dispatch('budsies/createNewPlushie', { productId: this.getCurrentProduct.id });
      this.$router.replace({
        name: 'pillow-product',
        params: { plushieId: task.result }
      });
    },
    async setCurrentProduct (): Promise<void> {
      if (this.getCurrentProduct) {
        return;
      }

      const product = this.getProductBySkuDictionary[pillowSku];
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
