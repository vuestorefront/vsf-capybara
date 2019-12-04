<template>
  <div class="mb35">
    <div class="row mb15">
      <div class="col-xs-12 col-sm-6">
        <h3 class="m0 mb5">
          {{ $t("My Recently viewed products") }}
        </h3>
      </div>
    </div>
    <div class="row">
      <div v-if="items && items.length > 0" class="col-xs-12">
        <product-listing columns="3" :products="items" />
      </div>
      <div v-else class="col-xs-12 h4">
        <p>{{ $t("No products yet") }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import RecentlyViewed from "@vue-storefront/core/modules/recently-viewed/components/RecentlyViewed";
import ProductListing from "theme/components/core/ProductListing.vue";

export default {
  components: {
    ProductListing
  },
  mixins: [RecentlyViewed]
};
</script>
