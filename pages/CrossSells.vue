<template>
  <div id="cross-sells" itemscope>
    <div class="_actions-container">
      <header class="sf-heading">
        <h2 class="sf-heading__title">
          Other pet gifts you might like
        </h2>
      </header>
      <SfButton class="sf-button actions__button" @click="goToCart">
        {{ $t("Continue to cart") }}
      </SfButton>
    </div>

    <div class="_cross-sells-list" v-if="crossSellsProducts.length">
      <div class="products">
        <transition-group
          appear
          name="products__slide"
          tag="div"
          class="products__grid"
        >
          <o-product-card
            v-for="crossSellsProduct in crossSellsProducts"
            :key="crossSellsProduct.id"
            :product="crossSellsProduct"
            :link="crossSellsProduct.landing_page_url ? crossSellsProduct.landing_page_url : undefined"
            link-tag="router-link"
            :wishlist-icon="false"
            class="products__product-card"
            :image-height="352"
            :image-width="352"
          />
        </transition-group>
      </div>
    </div>

    <div class="_up-sells-list" v-if="upSellsProducts.length">
      <header class="sf-heading">
        <h2 class="sf-heading__title">
          Accessorize Your Pet(sies)
        </h2>
      </header>
      <div class="products">
        <transition-group
          appear
          name="products__slide"
          tag="div"
          class="products__grid"
        >
          <o-product-card
            v-for="upSellsProduct in upSellsProducts"
            :key="upSellsProduct.id"
            :product="upSellsProduct"
            :link="upSellsProduct.landing_page_url ? upSellsProduct.landing_page_url : undefined"
            link-tag="router-link"
            :wishlist-icon="false"
            class="products__product-card"
            :image-height="352"
            :image-width="352"
          />
        </transition-group>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Route } from 'vue-router';
import config from 'config';
import { SearchQuery } from 'storefront-query-builder';
import { isServer } from '@vue-storefront/core/helpers';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import Product, { ProductLink } from 'core/modules/catalog/types/Product';
import { SfButton } from '@storefront-ui/vue';
import OProductCard from 'theme/components/organisms/o-product-card.vue';
import { prepareCategoryProduct } from 'theme/helpers';
import { PRODUCT_UNSET_CURRENT } from '@vue-storefront/core/modules/catalog/store/product/mutation-types';

const getSkuFromRoute = (route: Route): string | undefined => {
  return route.params.parentSku;
}

export default Vue.extend({
  name: 'CrossSells',
  components: {
    SfButton,
    OProductCard
  },
  data: function () {
    return {
      crossSellsProducts: [] as Product[],
      upSellsProducts: [] as Product[],
      isRouterLeaving: false
    }
  },
  computed: {
    getCurrentProduct (): Product | null {
      const product = this.$store.getters['product/getCurrentProduct'];
      const sku = getSkuFromRoute(this.$route);

      if (!product?.sku || product.sku !== sku) {
        return null;
      }

      return product;
    },
    getProductBySkuDictionary (): Record<string, Product> {
      return this.$store.getters['product/getProductBySkuDictionary'];
    }
  },
  async asyncData ({ store, route, context }) {
    const product = await store.dispatch(
      'product/loadProduct',
      {
        parentSku: getSkuFromRoute(route),
        setCurrent: false
      }
    );

    if (isServer) {
      await store.dispatch('product/setCurrent', product);
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
    productLinks (): ProductLink[] {
      if (!this.getCurrentProduct) {
        return [];
      }

      if (!this.getCurrentProduct.product_links) {
        return [];
      }

      return this.getCurrentProduct.product_links;
    },
    getSearchQuery (skus: string[]) {
      let productsQuery = new SearchQuery()
      productsQuery = productsQuery
        .applyFilter({ key: 'sku', value: { 'in': skus } })
        .applyFilter({ key: 'status', value: { 'in': [1] } });
      if (config.products.listOutOfStockProducts === false) {
        productsQuery = productsQuery.applyFilter({ key: 'stock.is_in_stock', value: { 'eq': true } });
      }
      return productsQuery;
    },
    async getProductsList (type: string): Promise<Product[]> {
      if (!this.getCurrentProduct) {
        return [];
      }

      const productLinks = this.productLinks();

      if (productLinks.length === 0) {
        return [];
      }

      let skus = productLinks
        .filter(productLink => productLink.link_type === type)
        .map(productLink => productLink.linked_product_sku)

      if (skus === null || (skus.length === 0)) {
        return [];
      }

      const { items } = await this.$store.dispatch('product/findProducts', {
        query: this.getSearchQuery(skus)
      });

      return items.map((item: Product) => ({ ...prepareCategoryProduct(item), landing_page_url: item.landing_page_url }));
    },
    async loadCrossSellsProducts () {
      this.crossSellsProducts = await this.getProductsList('crosssell');
    },
    async loadUpSellsProducts () {
      this.upSellsProducts = await this.getProductsList('upsell');
    },
    goToCart (): void {
      this.$router.push(localizedRoute({ name: 'detailed-cart' }));
    },
    redirectToCart (): void {
      this.$router.replace(localizedRoute({ name: 'detailed-cart' }));
    },
    async setCurrentProduct (): Promise<void> {
      const sku = getSkuFromRoute(this.$route);

      if (!sku || this.getCurrentProduct?.sku === sku) {
        return;
      }

      const product = this.getProductBySkuDictionary[sku];
      await this.$store.dispatch('product/setCurrent', product);
    }
  },
  watch: {
    $route: {
      async handler (val, oldVal) {
        if (isServer) {
          return;
        }

        if (val.path === oldVal?.path) {
          return;
        }

        await this.setCurrentProduct();
      },
      immediate: true
    },
    getCurrentProduct: {
      async handler (val) {
        if (isServer) {
          return;
        }

        if (!val) {
          this.crossSellsProducts = [];
          this.upSellsProducts = [];
          return;
        }

        Promise.all([
          this.loadCrossSellsProducts(),
          this.loadUpSellsProducts()
        ]).then(() => {
          if (!this.crossSellsProducts.length && !this.upSellsProducts.length) {
            this.redirectToCart();
          }
        });
      },
      immediate: false
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#cross-sells {
  box-sizing: border-box;

  .sf-heading {
    margin: 2em 0;
  }

  ._actions-container {
    text-align: center;
    margin-top: 1em;

    .sf-button {
      display: inline-block;
    }
  }

  ._cross-sells-list,
  ._up-sells-list {
    margin: 2em 0;
  }

  .products {
    box-sizing: border-box;
    flex: 1;
    margin: 0;

    &::v-deep {
      .sf-product-card {
        --image-width: 100%;

        margin: 0 auto;
        height: 100%;
      }
    }

    &__grid,
    &__list {
      display: flex;
      flex-wrap: wrap;
    }
    &__grid {
      justify-content: space-between;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(50%, 1fr));
    }
    &__product-card {
      --product-card-max-width: none;
      margin: 0 var(--spacer-xs);
      flex: 1 1 50%;
    }
    &__product-card-horizontal {
      flex: 0 0 100%;
    }
    &__slide-enter {
      opacity: 0;
      transform: scale(0.5);
    }
    &__slide-enter-active {
      transition: all 0.2s ease;
      transition-delay: calc(0.1s * var(--index));
    }
  }

  @media (min-width: $tablet-min) {
    .products {
      &__grid {
        grid-template-columns: repeat(auto-fit, minmax(33%, 1fr));
      }

      &__product-card {
        flex: 1 1 33%;
      }
    }
  }

  @include for-desktop {
    .products {
      max-width: 1272px;
      margin: var(--spacer-sm) auto;
      padding: 2em 0;

      &__grid {
        grid-template-columns: repeat(auto-fit, minmax(25%, 1fr));
      }

      &__pagination {
        display: flex;
        justify-content: center;
        margin: var(--spacer-xl) 0 0 0;
      }
      &__product-card-horizontal {
        margin: var(--spacer-lg) 0;
      }
      &__product-card {
        flex: 1 1 25%;
      }
      &__list {
        margin: 0 0 0 var(--spacer-sm);
      }
    }

    ._cross-sells-list {
      background: #e3f9ff;
    }
  }

  @media (min-width: $desktop-l-min) {
    .products {
      &__grid {
        grid-template-columns: repeat(auto-fit, minmax(20%, 1fr));
      }

      &__product-card {
        flex: 1 1 20%;
      }
    }
  }
}
</style>
