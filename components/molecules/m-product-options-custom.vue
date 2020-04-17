<template>
  <form class="m-product-options-custom">
    <div
      v-for="option in product.custom_options"
      :key="('customOption_' + option.option_id)"
      class="single-option"
    >
      <SfAlert
        v-if="getError(option.option_id).error"
        type="danger"
        :message="getError(option.option_id).message"
      />
      <SfHeading
        :title="option.title"
        :level="4"
        class="sf-heading--left"
      />
      <div v-if="option.type === 'field'">
        <SfInput
          type="text"
          :required="option.is_require"
          :label="option.title"
          :name="('customOption_' + option.option_id)"
          v-model="inputValues[('customOption_' + option.option_id)]"
          @change="optionChanged(option)"
        />
      </div>
      <div v-if="option.type === 'drop_down' || option.type === 'select'">
        <SfSelect
          class="sf-select--underlined"
          v-model="inputValues[('customOption_' + option.option_id)]"
          @change="optionChanged(option)"
          :required="option.is_require"
        >
          <SfSelectOption
            v-for="opval in option.values"
            :key="opval.option_type_id"
            :value="String(opval.option_type_id)"
          >
            <SfProductOption :label="opval.title" />
          </SfSelectOption>
        </SfSelect>
      </div>
      <div v-if="option.type === 'radio'">
        <SfRadio
          v-for="opval in option.values"
          :key="opval.option_type_id"
          :label="opval.title"
          :name="('customOption_' + option.option_id + opval.option_type_id)"
          :value="String(opval.option_type_id)"
          v-model="inputValues[('customOption_' + option.option_id)]"
          @change="optionChanged(option)"
          :required="option.is_require"
        />
      </div>
      <div v-if="option.type === 'checkbox'">
        <SfCheckbox
          v-for="opval in option.values"
          :key="opval.option_type_id"
          :label="opval.title"
          :name="('customOption_' + option.option_id + opval.option_type_id)"
          :value="String(opval.option_type_id)"
          v-model="inputValues[('customOption_' + option.option_id)]"
          @change="optionChanged(option)"
          :required="option.is_require"
        />
      </div>
      <SfDivider />
    </div>
  </form>
</template>

<script>
import { ProductCustomOptions } from '@vue-storefront/core/modules/catalog/components/ProductCustomOptions'
import { SfCheckbox, SfAlert, SfHeading, SfRadio, SfSelect, SfProductOption, SfInput, SfDivider } from '@storefront-ui/vue';
import get from 'lodash-es/get'
import { customOptionFieldName, defaultCustomOptionValue, selectedCustomOptionValue } from '@vue-storefront/core/modules/catalog/helpers/customOption';

export default {
  mixins: [ProductCustomOptions],
  components: {
    SfCheckbox,
    SfAlert,
    SfHeading,
    SfRadio,
    SfSelect,
    SfProductOption,
    SfInput,
    SfDivider
  },
  computed: {
    getError () {
      return optionId => {
        const error = get(this.validation.results, 'customOption_' + optionId, {})
        return error
      }
    },
    productOptions () {
      return this.product.custom_options.map(customOption => ({
        ...customOption,
        option_id: String(customOption.option_id),
        values: Array.isArray(customOption.values)
          ? customOption.values.map(value => ({
            ...value,
            option_type_id: String(value.option_type_id)
          }))
          : customOption.values
      }))
    },
    selectedOptions () {
      const customOptions = this.productOptions
      if (!customOptions) {
        return {}
      }

      return customOptions.reduce((selectedOptions, option) => {
        const fieldName = customOptionFieldName(option)
        selectedOptions[fieldName] = selectedCustomOptionValue(option.type, option.values, this.inputValues[fieldName])
        return selectedOptions
      }, {})
    }
  },
  methods: {
    setupInputFields () {
      for (const customOption of this.productOptions) {
        const fieldName = customOptionFieldName(customOption)
        this.$set(this.inputValues, fieldName, defaultCustomOptionValue(customOption))
        if (customOption.is_require) { // validation rules are very basic
          this.$set(this.validation.rules, fieldName, 'required') // TODO: add custom validators for the custom options
        }
        this.optionChanged(customOption)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-product-options-custom {
  margin: 0 var(--spacer-sm);
  @include for-desktop {
    margin: 0 var(--spacer-xl);
  }
}
.single-option {
  margin-top: 1.5rem;
}
.sf-divider {
  margin-top: 1.5rem;
}
</style>
