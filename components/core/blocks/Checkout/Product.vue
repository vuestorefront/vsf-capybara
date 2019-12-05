<template>
  <div class="row p25 between-xs">
    <div class="blend">
      <product-image :image="image" />
    </div>
    <div class="col-xs">
      <div class="row">
        <div class="col-xs-12 col-md-9 pb15">
          <div class="mb15">
            <div class="h4 weight-400 cl-accent serif">
              {{ product.name | htmlDecode }}
            </div>
            <div
              v-if="product.errors && Object.keys(product.errors).length > 0"
              class="error"
            >
              {{ product.errors | formatProductMessages }}
            </div>
            <div class="h5 cl-tertiary pt5">
              {{ product.sku }}
            </div>
            <div
              v-if="product.totals && product.totals.options"
              class="h6 cl-bg-tertiary pt5 options"
            >
              <div v-for="opt in product.totals.options" :key="opt.label">
                <span class="opn">{{ opt.label }}: </span>
                <span class="opv" v-text="opt.value" />
              </div>
            </div>
            <div
              v-else-if="product.options"
              class="h6 cl-bg-tertiary pt5 options"
            >
              <div v-for="opt in product.options" :key="opt.label">
                <span class="opn">{{ opt.label }}: </span>
                <span class="opv" v-text="opt.value" />
              </div>
            </div>
          </div>
          <div>
            <div>
              <span class="h5 cl-secondary">
                {{ $t("Qty") }}
                <span class="weight-700">
                  {{ product.qty }}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div class="col-xs-12 col-md-3 serif">
          <div v-if="isOnline && product.totals">
            <span v-if="product.totals.discount_amount" class="h4 cl-error"
              >{{
                (product.totals.row_total -
                  product.totals.discount_amount +
                  product.totals.tax_amount)
                  | price
              }}
            </span>
            <span
              v-if="product.totals.discount_amount"
              class="price-original h5"
              >{{ product.totals.row_total_incl_tax | price }}</span
            >
            <span v-if="!product.totals.discount_amount" class="h4">{{
              product.totals.row_total_incl_tax | price
            }}</span>
          </div>
          <div v-else>
            <span v-if="product.special_price" class="h4 cl-error"
              >{{ (product.price_incl_tax * product.qty) | price }}
            </span>
            <span v-if="product.special_price" class="price-original h5">{{
              (product.original_price_incl_tax * product.qty) | price
            }}</span>
            <span v-if="!product.special_price" class="h4">{{
              (product.price_incl_tax * product.qty) | price
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Product } from "@vue-storefront/core/modules/checkout/components/Product";
import { onlineHelper } from "@vue-storefront/core/helpers";
import ProductImage from "theme/components/core/ProductImage";

export default {
  components: {
    ProductImage
  },
  mixins: [Product],
  computed: {
    isOnline() {
      return onlineHelper.isOnline;
    },
    image() {
      return {
        loading: this.thumbnail,
        src: this.thumbnail
      };
    }
  }
};
</script>

<style scoped>
.price-original {
  text-decoration: line-through;
}
.blend {
  flex: 0 0 121px;
}
</style>
