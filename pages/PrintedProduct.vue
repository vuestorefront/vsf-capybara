<template>
  <div id="printed-product" itemscope itemtype="http://schema.org/Product">
    <o-printed-product-order-form
      :artwork-upload-url="artworkUploadUrl"
      :product="getCurrentProduct"
      :selected-style="productDesign"
      :existing-cart-item="existingCartItem"
      @style-selected="onStyleSelected"
      v-if="getCurrentProduct"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import config from 'config';
import { htmlDecode } from '@vue-storefront/core/filters';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import { PRODUCT_UNSET_CURRENT } from '@vue-storefront/core/modules/catalog/store/product/mutation-types';
import CartItem from 'core/modules/cart/types/CartItem';

import Product from 'core/modules/catalog/types/Product';

import OPrintedProductOrderForm from 'theme/components/organisms/o-printed-product-order-form.vue';

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
    },
    existingPlushieId: {
      type: String as PropType<string | undefined>,
      default: undefined
    }
  },
  data () {
    return {
      isRouterLeaving: false
    };
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
    cartItems (): CartItem[] {
      return this.$store.getters['cart/getCartItems'];
    },
    existingCartItem (): CartItem | undefined {
      if (!this.existingPlushieId) {
        return;
      }

      return this.cartItems.find((item) => item.plushieId && item.plushieId === this.existingPlushieId);
    }
  },
  async serverPrefetch () {
    if (this.$ssrContext) this.$ssrContext.output.cacheTags.add('product')

    await (this as any).loadData();
  },
  async mounted () {
    if (!this.getCurrentProduct) {
      await this.loadData();
    }
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
    async loadData (): Promise<void> {
      const product = await this.$store.dispatch('product/loadProduct', {
        parentSku: this.sku,
        setCurrent: true
      });

      await Promise.all([
        this.$store.dispatch('budsies/loadExtraPhotosAddons', { productId: product.id }),
        this.$store.dispatch('budsies/loadProductBodyparts', { productId: product.id })
      ]);

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
      await this.loadData();
    }
  },
  metaInfo () {
    const description = this.getCurrentProduct?.meta_description || this.getCurrentProduct?.short_description;

    return {
      title: htmlDecode(
        this.getCurrentProduct?.meta_title || this.getCurrentProduct?.name
      ),
      meta: description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: htmlDecode(description)
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
