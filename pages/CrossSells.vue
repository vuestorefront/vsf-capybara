<template>
  <div id="cross-sells" itemscope>
    <header class="sf-heading sf-heading--no-underline">
      <h2 class="sf-heading__title">
        Other pet gifts you might like
      </h2>
    </header>

    <div class="_actions-container">
      <SfButton class="sf-button actions__button" @click="goToCart">
        {{ $t("Continue to cart") }}
      </SfButton>
    </div>

    <div class="_cross-sells-list" v-if="crossSellsProducts">
      <o-product-card
        v-for="crossSellsProduct in crossSellsProducts"
        :key="crossSellsProduct.id"
        :product="crossSellsProduct"
        :link="crossSellsProduct.landing_url"
        link-tag="router-link"
        :wishlist-icon="false"
        class="products__product-card"
        :image-height="352"
        :image-width="352"
      />
    </div>

    <div class="_up-sells-list" v-if="upSellsProducts">
      <o-product-card
        v-for="upSellsProduct in upSellsProducts"
        :key="upSellsProduct.id"
        :product="upSellsProduct"
        :link="upSellsProduct.landing_url"
        link-tag="router-link"
        :wishlist-icon="false"
        class="products__product-card"
        :image-height="352"
        :image-width="352"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import config from 'config';
import { SearchQuery } from 'storefront-query-builder';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import Product, { ProductLink } from 'core/modules/catalog/types/Product';
import { ProductService } from '@vue-storefront/core/data-resolver/ProductService';
import { SfButton } from '@storefront-ui/vue';
import OProductCard from 'theme/components/organisms/o-product-card';

export default Vue.extend({
  name: 'CrossSells',
  components: {
    SfButton,
    OProductCard
  },
  data: function () {
    return {
      product: undefined as Product | undefined
    }
  },
  async asyncData ({ store, route, context }) {
    this.product = await ProductService.getProductByKey({
      options: {
        slug: route.params.slug
      },
      key: 'slug',
      skipCache: true
    });
  },
  methods: {
    productLinks (): ProductLink[] {
      if (!this.product) {
        return [];
      }

      if (!this.product.product_links) {
        return [];
      }

      return this.product.product_links;
    },
    getSearchQuery (skus: string[]) {
      let productsQuery = new SearchQuery()
      productsQuery = productsQuery
        .applyFilter({ key: 'sku', value: { 'in': skus } })
        .applyFilter({ key: 'status', value: { 'in': [1] } })
      if (config.products.listOutOfStockProducts === false) {
        productsQuery = productsQuery.applyFilter({ key: 'stock.is_in_stock', value: { 'eq': true } })
      }
      return productsQuery
    },
    async getProductsList (type: string): Promise<Product[]> {
      if (!this.product) {
        return [];
      }

      if (!this.product.product_links || this.product.product_links.length === 0) {
        return [];
      }

      let sku = this.product.product_links ? this.product.product_links
        .filter(productLink => productLink.link_type === type)
        .map(productLink => productLink.linked_product_sku) : null

      if (sku === null || (sku.length === 0)) {
        return [];
      }

      // let sku = [
      //   'customPrintedMasks_bundle', 'petsiesPhrasePillow_bundle', 'customPrintedSocks_bundle'
      // ];
      const { items } = await this.$store.dispatch('product/findProducts', {
        query: this.getSearchQuery(sku)
      });

      return items;
    },
    async crossSellsProducts (): Promise<Product[]> {
      return this.getProductsList('crosssell');
    },
    async upSellsProducts (): Promise<Product[]> {
      return this.getProductsList('upsell');
    },
    goToCart (): void {
      this.$router.push(localizedRoute('/cart'));
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#cross-sells {
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

  ._cross-sells-list {
    margin: 1em 0;
  }
}
</style>
