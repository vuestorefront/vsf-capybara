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
  mixins: [ProductAttribute],
  components: {
    SfProperty
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.a-product-attribute {
  padding: $spacer-small 0;
}
</style>