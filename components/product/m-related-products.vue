<template>
  <m-product-carousel
    v-if="getCurrentRelatedProducts.length"
    :products="getCurrentRelatedProducts"
  />
</template>

<script>
import MProductCarousel from 'theme/components/molecules/m-product-carousel';
import { mapGetters } from 'vuex';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';
import config from 'config';

export default {
  name: 'MRelatedProducts',
  components: {
    MProductCarousel
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getProductRelated: 'product/getProductRelated',
      getCurrentProduct: 'product/getCurrentProduct'
    }),
    getCurrentRelatedProducts () {
      return this.getProductRelated[this.type] || [];
    },
    productLinks () {
      return this.getCurrentProduct.product_links;
    }
  },
  beforeMount () {
    this.$bus.$on('product-after-load', this.refreshList);

    if (config.usePriceTiers) {
      this.$bus.$on('user-after-loggedin', this.refreshList);
      this.$bus.$on('user-after-logout', this.refreshList);
    }

    this.refreshList();
  },
  beforeDestroy () {
    if (config.usePriceTiers) {
      this.$bus.$off('user-after-loggedin', this.refreshList);
      this.$bus.$off('user-after-logout', this.refreshList);
    }
    this.$bus.$off('product-after-load', this.refreshList);
  },
  methods: {
    async refreshList () {
      let sku = this.productLinks
        ? this.productLinks
          .filter(pl => pl.link_type === this.type)
          .map(pl => pl.linked_product_sku)
        : null;

      let key = 'sku';
      if (sku === null || sku.length === 0) {
        sku = this.getCurrentProduct.category_ids;
        key = 'category_ids';
      }
      let relatedProductsQuery = prepareRelatedQuery(key, sku);

      const response = await this.$store.dispatch('product/findProducts', {
        query: relatedProductsQuery,
        size: 8,
        prefetchGroupProducts: false,
        updateState: false
      });
      if (response) {
        this.$store.dispatch('product/related', {
          key: this.type,
          items: response.items
        });
        this.$forceUpdate();
      }
    }
  }
};
</script>
