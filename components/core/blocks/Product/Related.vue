<template>
  <section
    v-if="getCurrentRelatedProducts.length"
    class="py20 new-collection container px15"
  >
    <div>
      <header class="col-md-12">
        <h2 class="align-center cl-accent">
          {{ heading }}
        </h2>
      </header>
    </div>
    <product-listing columns="4" :products="getCurrentRelatedProducts" />
  </section>
</template>

<script>
import ProductListing from 'theme/components/core/ProductListing';
import { mapGetters } from 'vuex';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';
import i18n from '@vue-storefront/i18n';
import config from 'config';

export default {
  name: 'Related',
  components: {
    ProductListing
  },
  props: {
    type: {
      type: String,
      required: true
    },
    heading: {
      type: String,
      required: false,
      default: i18n.t('Similar products')
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
  },
  destroyed () {
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

      const response = await this.$store.dispatch('product/list', {
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
