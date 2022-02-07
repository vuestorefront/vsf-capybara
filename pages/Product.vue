<template>
  <div id="product" itemscope itemtype="http://schema.org/Product">
    <template v-if="getCurrentProduct">
      <OProductDetails
        :product="getCurrentProduct"
        :product-gallery="getProductGallery"
        :product-configuration="getCurrentProductConfiguration"
        :product-custom-options="getCurrentCustomOptions"
        :product-attributes="getCustomAttributes"
        :product-stock="stock"
      />

      <MProductDescriptionStory
        class="_product-full-description"
        :product="getCurrentProduct"
      />

      <div class="product__bottom">
        <lazy-hydrate when-idle>
          <MRelatedProducts
            :title-heading="$t('We found other products you might like')"
            type="upsell"
          />
        </lazy-hydrate>
        <lazy-hydrate when-idle>
          <MRelatedProducts
            :title-heading="$t('Similar Products')"
            type="related"
          />
        </lazy-hydrate>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import LazyHydrate from 'vue-lazy-hydration';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import { htmlDecode } from '@vue-storefront/core/filters';
import { onlineHelper, isServer } from '@vue-storefront/core/helpers';
import { catalogHooksExecutors } from '@vue-storefront/core/modules/catalog-next/hooks';
import MRelatedProducts from 'theme/components/molecules/m-related-products';
import OProductDetails from 'theme/components/organisms/o-product-details';
import { filterChangedProduct } from '@vue-storefront/core/modules/catalog/events';
import { getMediaGallery } from '@vue-storefront/core/modules/catalog/helpers';
import { PRODUCT_UNSET_CURRENT } from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

import MProductDescriptionStory from 'theme/components/molecules/m-product-description-story.vue';

const getSkusFromRoute = (route) => {
  const childSku = route && route.params && route.params.childSku
    ? route.params.childSku
    : null;

  return {
    parentSku: route.params.parentSku,
    childSku
  };
}

export default {
  name: 'Product',
  components: {
    LazyHydrate,
    MRelatedProducts,
    OProductDetails,
    MProductDescriptionStory
  },
  provide () {
    return {
      configurableOptionCallback: this.configurableOptionCallback
    }
  },
  data () {
    return {
      stock: {
        isLoading: false,
        max: 0,
        manageQuantity: true
      },
      isRouterLeaving: false
    };
  },
  computed: {
    ...mapState({
      isWebpSupported: state => state.ui.isWebpSupported
    }),
    ...mapGetters({
      getCurrentCategory: 'category-next/getCurrentCategory',
      getCurrentProduct: 'product/getCurrentProduct',
      getCurrentProductConfiguration: 'product/getCurrentProductConfiguration',
      getOriginalProduct: 'product/getOriginalProduct',
      attributesByCode: 'attribute/attributeListByCode',
      getCurrentCustomOptions: 'product/getCurrentCustomOptions',
      promotedOffers: 'promoted/getPromotedOffers'
    }),
    isOnline () {
      return onlineHelper.isOnline;
    },
    getProductGallery () {
      const currentConfiguration = this.getCurrentProductConfiguration;

      if (!currentConfiguration || Object.keys(currentConfiguration).length === 0) {
        return this.$store.getters['product/getProductGallery'];
      }

      return this.getCurrentConfigurationProductGallery(currentConfiguration);
    },
    getCustomAttributes () {
      return Object.values(this.attributesByCode)
        .filter(a => {
          return (
            a.is_visible &&
            a.is_user_defined &&
            (parseInt(a.is_visible_on_front) ||
              a.is_visible_on_front === true) &&
            this.getCurrentProduct[a.attribute_code]
          );
        })
        .sort((a, b) => {
          return a.attribute_id > b.attribute_id;
        });
    },
    getProductBySkuDictionary () {
      return this.$store.getters['product/getProductBySkuDictionary'];
    }
  },
  watch: {
    isOnline: {
      handler (isOnline) {
        if (isOnline) {
          this.getQuantity();
        }
      }
    },
    async $route (val, oldVal) {
      if (val.path === oldVal.path) {
        return;
      }

      await this.setCurrentProduct();
      this.getQuantity();
    }
  },
  async asyncData ({ store, route, context }) {
    if (context) context.output.cacheTags.add('product')

    const { parentSku, childSku } = getSkusFromRoute(route);

    const product = await store.dispatch('product/loadProduct', {
      parentSku,
      childSku,
      setCurrent: false
    });

    if (isServer) await store.dispatch('product/setCurrent', product)

    catalogHooksExecutors.productPageVisited(product);
  },
  async mounted () {
    await this.setCurrentProduct();
    this.getQuantity();
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
    async configurableOptionCallback (variant) {
      const selectedConfiguration = Object.assign({ attribute_code: variant.type }, variant)
      await filterChangedProduct(selectedConfiguration, this.$store, this.$router)
      this.getQuantity();
    },
    getCurrentConfigurationProductGallery (currentConfiguration) {
      const idByCodeDictionary = {}

      const attributeCodes = this.getCurrentProduct.configurable_options.map((option) => option.attribute_code);
      attributeCodes.forEach((code) => {
        if (currentConfiguration[code] && currentConfiguration[code].id) {
          idByCodeDictionary[code] = currentConfiguration[code].id;
        }
      })

      const child = this.getCurrentProduct.configurable_children.find((item) => {
        return attributeCodes.every((code) => item[code].toString() === idByCodeDictionary[code]);
      })

      return getMediaGallery(child);
    },
    async getQuantity () {
      if (this.stock.isLoading) return; // stock info is already loading
      this.stock.isLoading = true;
      try {
        const res = await this.$store.dispatch('stock/check', {
          product: this.getCurrentProduct,
          qty: this.getCurrentProduct.qty
        });
        this.stock.manageQuantity = res.isManageStock;
        this.stock.max = res.isManageStock ? res.qty : null;
      } finally {
        this.stock.isLoading = false;
      }
    },
    async setCurrentProduct () {
      const { parentSku, childSku } = getSkusFromRoute(this.$route);
      const sku = childSku || parentSku;

      if (this.getCurrentProduct?.sku === sku) {
        return;
      }

      const product = this.getProductBySkuDictionary[sku];
      await this.$store.dispatch('product/setCurrent', product);
    }
  },
  metaInfo () {
    const storeView = currentStoreView();
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

#product {
  box-sizing: border-box;
  padding-top: var(--spacer-base);

  ._product-full-description {
    margin-top: var(--spacer-xl);
  }

  @include for-desktop {
    max-width: 1272px;
    width: 100%;
    margin: 0 auto;
  }
}

.product__bottom {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    padding: 0;
    max-width: 1272px;
  }
}

::v-deep {
  .product__colors button {
    border: 1px solid var(--c-light);
  }
}

.banner {
  margin: var(--spacer-xl) 0;
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
  }
}
</style>
