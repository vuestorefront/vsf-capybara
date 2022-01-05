<template>
  <div class="m-product-options-configurable">
    <SfAlert
      v-if="product.errors && Object.keys(product.errors).length > 0"
      class="m-product-call-to-action__alert"
      :message="product.errors | formatProductMessages"
      type="danger"
    />

    <template v-for="attribute in productAttributes">
      <SfSelect
        :key="attribute.id"
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

      <div v-else :key="attribute.id" class="product__colors">
        <p class="product__color-label">
          {{ attribute.label }}:
        </p>
        <SfColor
          v-for="attributeOption in availableOptions[attribute.attribute_code]"
          :key="attributeOption.id"
          :color="getColorValue(attributeOption)"
          class="product__color"
          :selected="isColorSelected(attributeOption)"
          @click="handleChangeOption(attributeOption)"
        />
      </div>
    </template>
  </div>
</template>
<script>
import config from 'config'
import { mapGetters } from 'vuex';
import get from 'lodash-es/get'
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
    ...mapGetters({
      getCurrentProductOptions: 'product/getCurrentProductOptions'
    }),
    getActiveOption () {
      return (attribute) => get(this.configuration, `${attribute.attribute_code}.id`, attribute.id)
    },
    getAttributeLabel () {
      return (attribute) => {
        const configName = attribute.attribute_code ? attribute.attribute_code : attribute.label.toLowerCase()
        const optionId = this.configuration[configName] ? this.configuration[configName].id : ''
        const option = this.getCurrentProductOptions[configName].find(o => o.id === optionId)
        return option.hasOwnProperty('label') ? option.label : ''
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
    },
    isColorSelected () {
      return attributeOption => this.configuration.color && parseInt(this.configuration.color.id) === parseInt(attributeOption.id);
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

@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.product {
  &__select-size {
    width: 100%;
    margin-top: var(--spacer-base);
  }

  &__colors {
    display: flex;
    width: 100%;
    align-items: center;
  }

  &__color-label {
    margin-right: var(--spacer-base);
  }

  &__color {
    border: 1px solid var(--c-light);
    margin: 0 var(--spacer-2xs);
  }
}
</style>
