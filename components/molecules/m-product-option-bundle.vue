<template>
  <div class="a-product-option-bundle">
    <SfAlert
      v-if="errorMessage"
      class="a-product-option-bundle__alert"
      :message="errorMessage"
      type="danger"
    />
    <SfHeading
      :title="option.title"
      :level="4"
      class="sf-heading--left"
    />
    <SfRadio
      v-for="link in option.product_links"
      :key="link.id"
      :label="link.product && link.product.name"
      :name="link.product && link.product.name"
      :value="link.id"
      v-model="productOptionId"
    >
      <template #label="{label}">
        <div class="a-product-option-bundle__label">
          <div class="sf-radio__label">
            {{ label }}
          </div>
          <AProductPrice :product="link.product" />
        </div>
      </template>
      <template #description>
        <div class="hidden" />
      </template>
    </SfRadio>
    <AProductQuantity v-model="quantity" unlimit-quantity />
    <SfDivider />
  </div>
</template>

<script>
import { ProductBundleOption } from '@vue-storefront/core/modules/catalog/components/ProductBundleOption';
import { SfHeading, SfRadio, SfDivider, SfAlert } from '@storefront-ui/vue';
import AProductPrice from 'theme/components/atoms/a-product-price'
import AProductQuantity from 'theme/components/atoms/a-product-quantity'

export default {
  mixins: [ProductBundleOption],
  name: 'MProductOptionBundle',
  components: {
    AProductPrice,
    SfHeading,
    SfRadio,
    SfDivider,
    AProductQuantity,
    SfAlert
  }
};
</script>
<style lang="scss" scoped>
.a-product-option-bundle {
  margin-top: 1.5rem;
  &__label {
    display: flex;
    justify-content: space-between;
  }
  &__alert {
    margin-bottom: 1rem;
  }
}
::v-deep {
  .a-product-quantity {
    margin-top: 1rem;
    height: 3rem;
    min-height: 3rem;
  }
}
</style>
