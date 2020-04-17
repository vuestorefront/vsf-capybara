<template>
  <div class="m-product-options-configurable">
    <SfAlert
      v-if="product.errors && Object.keys(product.errors).length > 0"
      class="m-product-call-to-action__alert"
      :message="product.errors | formatProductMessages"
      type="danger"
    />
    <div v-for="attribute in productAttributes" :key="attribute.id">
      <SfSelect
        v-if="attribute.attribute_code !== 'color'"
        :label="getAttributeLabel(attribute)"
        :value="getActiveOption(attribute)"
        @change="handleChangeOption"
        class="sf-select--underlined product__select-size"
      >
        <SfSelectOption
          v-for="attributeOption in availableOptions[attribute.attribute_code]"
          :key="attributeOption.id"
          :value="attributeOption"
        >
          <SfProductOption :label="attributeOption.label" />
        </SfSelectOption>
      </SfSelect>
    </div>
    <div v-for="attribute in productAttributes" :key="attribute.id">
      <div v-if="attribute.attribute_code === 'color'" class="product__colors desktop-only">
        <p class="product__color-label">
          {{ attribute.label }}:
        </p>
        <SfColor
          v-for="attributeOption in availableOptions[attribute.attribute_code]"
          :key="attributeOption.id"
          :color="getColorValue(attributeOption)"
          class="product__color"
          :selected="parseInt(configuration.color.id) === parseInt(attributeOption.id)"
          @click="handleChangeOption(attributeOption)"
        />
      </div>
    </div>
  </div>
</template>
<script>
import get from 'lodash-es/get'
import config from 'config'
import { SfAlert, SfSelect, SfProductOption, SfColor } from '@storefront-ui/vue';
import { getAvailableFiltersByProduct } from '@vue-storefront/core/modules/catalog/helpers/filters'
export default {
  name: 'MProductOptionsConfigurable',
  inject: {
    configurableOptionCallback: { default: false }
  },
  components: {
    SfAlert,
    SfSelect,
    SfProductOption,
    SfColor
  },
  props: {
    product: {
      type: Object,
      required: true
    },
    configuration: {
      type: Object,
      required: true
    }
  },
  computed: {
    getActiveOption () {
      return (attribute) => get(this.configuration, `${attribute.attribute_code}.id`, attribute.id)
    },
    getAttributeLabel () {
      return (attribute) => {
        const configName = attribute.attribute_code ? attribute.attribute_code : attribute.label.toLowerCase()
        return this.configuration[configName] ? this.configuration[configName].label : configName
      }
    },
    productAttributes () {
      if (
        this.product.errors &&
        Object.keys(this.product.errors).length &&
        Object.keys(this.configuration).length
      ) {
        return [];
      }
      return this.product.configurable_options;
    },
    availableOptions () {
      return getAvailableFiltersByProduct(this.product)
    },
    getColorValue () {
      return (option) => option.type === 'color'
        ? get(config.products.colorMappings, option.label, option.label)
        : undefined
    }
  },
  methods: {
    handleChangeOption (option) {
      const selectedVariant = { ...option, attribute_code: option.type }
      if (this.configurableOptionCallback) {
        this.configurableOptionCallback(selectedVariant)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.m-product-options-configurable {
  border-bottom: 1px solid #f1f2f3;
  padding-bottom: 10px;
  @include for-desktop {
    border: 0;
    padding-bottom: 0;
  }
}
.attribute {
  margin-bottom: var(--spacer-xl);
}

.product {
  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }
  &__colors {
    @include font(
      --product-color-font,
      var(--font-normal),
      var(--font-lg),
      1.6,
      var(--font-family-secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }
  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
}
</style>
