<template>
  <SfSection
    :title-heading="titleHeading"
    v-if="getCurrentRelatedProducts.length"
  >
    <m-product-carousel
      :products="getCurrentRelatedProducts"
    />
  </SfSection>
</template>

<script>
import config from 'config';
import { mapGetters } from 'vuex';
import { SfSection } from '@storefront-ui/vue';
import { prepareRelatedQuery } from '@vue-storefront/core/modules/catalog/queries/related';

import MProductCarousel from 'theme/components/molecules/m-product-carousel';

export default {
  name: 'MRelatedProducts',
  components: {
    MProductCarousel,
    SfSection
  },
  props: {
    titleHeading: {
      type: String,
      default: ''
    },
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
  methods: {
    async refreshList () {
      let items = [];
      const key = 'sku';
      const sku = this.productLinks
        ? this.productLinks
          .filter(pl => pl.link_type === this.type)
          .map(pl => pl.linked_product_sku)
        : null;

      if (sku !== null && sku.length > 0) {
        let relatedProductsQuery = prepareRelatedQuery(key, sku);

        const response = await this.$store.dispatch('product/findProducts', {
          query: relatedProductsQuery,
          size: 8,
          prefetchGroupProducts: false,
          updateState: false
        });

        if (response && response.items) {
          items = response.items;
        }
      }

      await this.$store.dispatch('product/related', {
        key: this.type,
        items: items
      });
      this.$forceUpdate();
    }
  },
  watch: {
    getCurrentProduct (val) {
      if (val) {
        this.refreshList();
      }
    }
  }
};
</script>
