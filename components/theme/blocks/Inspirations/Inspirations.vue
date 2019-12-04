<template>
  <div class="inspirations">
    <div class="row">
      <div
        v-for="(product, index) in products"
        :key="index"
        class="col-md-4 p15"
      >
        <inspiration-tile :product="product" />
      </div>
    </div>
  </div>
</template>

<script>
import { prepareQuery } from "@vue-storefront/core/modules/catalog/queries/common";

import InspirationTile from "./InspirationTile.vue";
export default {
  name: "Inspirations",
  components: {
    InspirationTile
  },

  data() {
    return {
      products: []
    };
  },

  beforeMount() {
    let inspirationsQuery = prepareQuery({ queryConfig: "inspirations" });
    this.$store
      .dispatch("product/list", {
        query: inspirationsQuery,
        size: 3,
        sort: "created_at:desc"
      })
      .then(res => {
        if (res) {
          this.products = res.items;
        }
      });
  }
};
</script>
