<template>
  <div class="m-product-options-configurable">
    <SfAlert
      v-if="product.errors && Object.keys(product.errors).length > 0"
      class="m-product-call-to-action__alert"
      :message="product.errors | formatProductMessages"
      type="danger"
    />
    <SfSelect
      v-for="attribute in productAttributes"
      :key="attribute.id"
      :label="getAttributeLabel(attribute)"
      :value="getActiveOption(attribute)"
      @change="handleChangeOption"
      class="sf-select--bordered attribute"
    >
      <SfSelectOption
        v-for="attributeOption in availableOptions[attribute.attribute_code]"
        :key="attributeOption.id"
        :value="attributeOption"
      >
        <SfProductOption
          :label="attributeOption.label"
          :color="getColorValue(attributeOption)"
        />
      </SfSelectOption>
    </SfSelect>
  </div>
</template>
<script>
import get from 'lodash-es/get'
import config from 'config'
import { SfAlert, SfSelect, SfProductOption } from '@storefront-ui/vue';
import { getAvailableFiltersByProduct } from '@vue-storefront/core/modules/catalog/helpers/filters'
export default {
  name: 'MProductOptionsConfigurable',
  inject: {
    configurableOptionCallback: { default: false }
  },
  components: {
    SfAlert,
    SfSelect,
    SfProductOption
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
  margin-bottom: var(--spacer-big);
}
</style>
