<template>
  <div>
    <div class="brdr-bottom-1 brdr-cl-primary pb60">
      <h3 class="cl-accent ml30 mt50 summary-title">
        {{ $t("Order Summary") }}
      </h3>
      <product
        v-for="product in productsInCart"
        :key="product.sku"
        :product="product"
      />
      <div
        v-if="productsInCart && productsInCart.length"
        class="checkout bg-cl-secondary pt10 serif cl-accent"
      >
        <div
          v-for="(segment, index) in notGrandTotals"
          :key="index"
          class="row pt15 pb20 pl30 pr55 "
        >
          <div class="col-xs cl-accent">
            {{ segment.title }}
          </div>
          <div
            v-if="segment.value != null"
            class="col-xs align-right cl-accent h4"
          >
            {{ segment.value | price }}
          </div>
        </div>

        <div
          v-for="(segment, index) in grandTotals"
          :key="index"
          class="row pt20 pb20 pl30 pr55 weight-400 h3"
        >
          <div class="col-xs">
            {{ segment.title }}
          </div>
          <div class="col-xs align-right">
            {{ segment.value | price }}
          </div>
        </div>
      </div>
    </div>
    <div class="py50 px25">
      <h4 class="h3 m0">
        {{ $t("Safety") }}
      </h4>
      <p class="cl-tertiary lh20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
      <h4 v-if="!isVirtualCart" class="h3 mb0">
        {{ $t("Shipping") }}
      </h4>
      <p v-if="!isVirtualCart" class="cl-tertiary lh20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
      <h4 class="h3 mb0">
        {{ $t("Returns") }}
      </h4>
      <p class="cl-tertiary lh20">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sed
        tempor lorem. Vivamus volutpat eros id est semper accumsan.
      </p>
    </div>
  </div>
</template>

<script>
import { CartSummary } from "@vue-storefront/core/modules/checkout/components/CartSummary";
import Product from "./Product";

export default {
  components: {
    Product
  },
  mixins: [CartSummary],
  computed: {
    notGrandTotals() {
      return this.totals.filter(total => total.code !== "grand_total");
    },
    grandTotals() {
      return this.totals.filter(total => total.code === "grand_total");
    }
  }
};
</script>

<style lang="scss" scoped>
.summary-title {
  @media (max-width: 767px) {
    margin-left: 0;
  }
}
</style>
