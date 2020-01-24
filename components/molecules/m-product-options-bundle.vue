<template>
  <div class="m-product-options-bundle">
    <MProductOptionBundle
      v-for="option in product.bundle_options"
      :key="('bundleOption_' + option.option_id)"
      :option="option"
      @option-changed="optionChanged"
      :error-messages="errorMessages"
    />
  </div>
</template>

<script>
import { ProductBundleOptions } from '@vue-storefront/core/modules/catalog/components/ProductBundleOptions'
import MProductOptionBundle from 'theme/components/molecules/m-product-option-bundle'

export default {
  mixins: [ProductBundleOptions],
  components: {
    MProductOptionBundle
  }
}
</script>
