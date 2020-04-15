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
.a-product-attribute {
  padding: var(--spacer-sm) 0;
}
</style>
