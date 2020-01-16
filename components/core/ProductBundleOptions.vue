<template>
  <form class="custom-options">
    <div
      v-for="option in product.bundle_options"
      :key="'bundleOption_' + option.option_id"
    >
      <product-bundle-option
        :option="option"
        :error-messages="errorMessages"
        @option-changed="optionChanged"
      />
    </div>
  </form>
</template>

<script>
import { ProductBundleOptions } from '@vue-storefront/core/modules/catalog/components/ProductBundleOptions.ts';
import ProductBundleOption from './ProductBundleOption';

export default {
  components: {
    ProductBundleOption
  },
  mixins: [ProductBundleOptions]
};
</script>
<style lang="scss" scoped></style>
