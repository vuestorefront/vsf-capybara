<template>
  <div id="printed-product" itemscope itemtype="http://schema.org/Product">
    <o-printed-product-order-form
      artwork-upload-url="/"
      form-action="/"
      :product="getCurrentProduct"
      :product-id="getCurrentProduct.id + ''"
      :product-sku="getCurrentProduct.sku"
      product-type="23"
      :product-price="price.regular"
      :product-special-price="price.special"
      :product-quantity="getCurrentProduct.qty"
      :product-description="getCurrentProduct.description"
      :product-short-description="getCurrentProduct.short_description"
      :product-name="getCurrentProduct.name"
      :product-images="getProductImages"
      initial-style-value="simplePrintedKeychains"
      :available-styles="getAvailableStyles"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { getProductPrice } from 'theme/helpers';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { htmlDecode } from '@vue-storefront/core/filters';
import { onlineHelper, isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import OPrintedProductOrderForm from 'theme/components/organisms/o-printed-product-order-form';

export default {
  name: 'PrintedProduct',
  components: {
    OPrintedProductOrderForm
  },
  computed: {
    ...mapGetters({
      getCurrentProduct: 'product/getCurrentProduct',
      getProductGallery: 'product/getProductGallery',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      getOriginalProduct: 'product/getOriginalProduct',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      attributesByCode: 'attribute/attributeListByCode'
    }),
    isOnline () {
      return onlineHelper.isOnline;
    },
    price () {
      return getProductPrice(this.getCurrentProduct, this.getCurrentCustomOptions, false);
    },
    getProductImages () {
      const images = this.getProductGallery.map(imageObject => ({
        stage: imageObject.src,
        thumb: imageObject.src,
        big: imageObject.src,
        alt: this.getCurrentProduct.name,
        title: this.getCurrentProduct.name
      }));

      return [
        {
          sku: this.getCurrentProduct.sku,
          images: images
        }
      ]
    },
    getAvailableStyles () {
      const simpleProducts = this.getCurrentProduct.bundle_options[0].product_links.map(linkedProduct => ({
        value: linkedProduct.product.sku,
        label: linkedProduct.product.name,
        description: linkedProduct.product.description,
        shortDescription: linkedProduct.product.short_description,
        price: linkedProduct.product.regular_price,
        specialPrice: linkedProduct.product.special_price
      }));

      return simpleProducts;
    }
  },
  data () {
    return {
      stock: {
        isLoading: false,
        max: 0,
        manageQuantity: true
      }
    };
  },
  watch: {
    isOnline: {
      handler (isOnline) {
        if (isOnline) {
          this.getQuantity();
        }
      }
    }
  },
  async asyncData ({ store, route, context }) {
    if (context) context.output.cacheTags.add('product')
    const product = await store.dispatch('product/loadProduct', {
      parentSku: route.params.parentSku,
      childSku:
        route && route.params && route.params.childSku
          ? route.params.childSku
          : null
    });
    const loadBreadcrumbsPromise = store.dispatch(
      'product/loadProductBreadcrumbs',
      { product }
    );
    if (isServer) await loadBreadcrumbsPromise;
    catalogHooksExecutors.productPageVisited(product);
  },
  beforeRouteEnter (to, from, next) {
    if (isServer) {
      next();
    } else {
      next(vm => {
        vm.getQuantity();
      });
    }
  },
  methods: {
    async getQuantity () {
      if (this.stock.isLoading) return; // stock info is already loading
      this.stock.isLoading = true;
      try {
        const res = await this.$store.dispatch('stock/check', {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty
        });
        this.manageQuantity = res.isManageStock;
        this.stock.max = res.isManageStock ? res.qty : null;
      } finally {
        this.stock.isLoading = false;
      }
    }
  },
  metaInfo () {
    const storeView = currentStoreView();
    return {
      title: htmlDecode(
        this.getCurrentProduct.meta_title || this.getCurrentProduct.name
      ),
      meta: this.getCurrentProduct.meta_description
        ? [
          {
            vmid: 'description',
            name: 'description',
            content: htmlDecode(this.getCurrentProduct.meta_description)
          }
        ]
        : []
    };
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#printed-product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}

.o-printed-product-order-form {
  margin-top: var(--spacer-lg);
}

::v-deep {
  .product__colors button {
      border: 1px solid var(--c-light);
  }
}
</style>
