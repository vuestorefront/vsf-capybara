<template>
  <div class="a-product-option-bundle">
    <SfAlert
      v-if="errorMessage"
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
        <div class="label">
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
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.a-product-option-bundle {
  margin: var(--spacer-xl) var(--spacer-sm) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 0;
  }
}
.label {
  display: flex;
  justify-content: space-between;
}
::v-deep {
  .a-product-quantity {
    margin-top: 1rem;
    height: 3rem;
    min-height: 3rem;
  }
}
.sf-divider {
  margin-top: var(--spacer-xl);
}
</style>
