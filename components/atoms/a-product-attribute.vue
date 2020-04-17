<template>
  <SfProperty
    class="a-product-attribute"
    :name="label | htmlDecode"
    :value="value | htmlDecode"
  />
</template>

<script>
import { SfProperty } from '@storefront-ui/vue';
import { ProductAttribute } from '@vue-storefront/core/modules/catalog/components/ProductAttribute';

export default {
  name: 'AProductAttribute',
  mixins: [ProductAttribute],
  components: {
    SfProperty
  }
};
</script>
