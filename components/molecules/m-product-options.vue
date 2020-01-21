<template>
  <div class="m-product-options">
    <SfSelect
      v-model="size"
      label="Size"
      class="sf-select--bordered m-product-options__attribute"
    >
      <SfSelectOption
        v-for="sizeOption in sizes"
        :key="sizeOption.value"
        :value="sizeOption.value"
      >
        <SfProductOption :label="sizeOption.label" />
      </SfSelectOption>
    </SfSelect>
    <SfSelect
      v-model="color"
      label="Color"
      class="sf-select--bordered m-product-options__attribute"
    >
      <SfSelectOption
        v-for="colorOption in colors"
        :key="colorOption.value"
        :value="colorOption.value"
      >
        <SfProductOption
          :label="colorOption.label"
          :color="colorOption.color"
        />
      </SfSelectOption>
    </SfSelect>
  </div>
</template>
<script>
import { SfSelect, SfProductOption } from '@storefront-ui/vue';
export default {
  name: 'MProductOptions',
  components: {
    SfSelect,
    SfProductOption
  },
  data () {
    return {
      size: '',
      sizes: [
        { label: 'XXS', value: 'xxs' },
        { label: 'XS', value: 'xs' },
        { label: 'S', value: 's' },
        { label: 'M', value: 'm' },
        { label: 'L', value: 'l' },
        { label: 'XL', value: 'xl' },
        { label: 'XXL', value: 'xxl' }
      ],
      color: '',
      colors: [
        { label: 'Red', value: 'red', color: '#990611' },
        { label: 'Black', value: 'black', color: '#000000' },
        { label: 'Yellow', value: 'yellow', color: '#DCA742' },
        { label: 'Blue', value: 'blue', color: '#004F97' },
        { label: 'Navy', value: 'navy', color: '#656466' },
        { label: 'White', value: 'white', color: '#FFFFFF' }
      ]
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.m-product-options {
  border-bottom: 1px solid #f1f2f3;
  padding-bottom: 10px;
  @include for-desktop {
    border: 0;
    padding-bottom: 0;
  }
  &__attribute {
    margin-bottom: $spacer-big;
  }
}
</style>
