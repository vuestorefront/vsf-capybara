<template>
  <form class="m-product-options-custom">
    <div v-for="option in product.custom_options" :key="('customOption_' + option.option_id)">
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
          :required="true"
          :label="option.title"
          :name="('customOption_' + option.option_id)"
          v-model="inputValues[('customOption_' + option.option_id)]"
          @change="optionChanged(option)"
        />
      </div>
      <div v-if="option.type === 'drop_down' || option.type === 'select'">
        <SfSelect
          class="sf-select--bordered"
          v-model="inputValues[('customOption_' + option.option_id)]"
          :required="true"
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
        />
      </div>
    </div>
  </form>
</template>

<script>
import { ProductCustomOptions } from '@vue-storefront/core/modules/catalog/components/ProductCustomOptions'
import { SfCheckbox, SfAlert, SfHeading, SfRadio, SfSelect, SfProductOption, SfInput } from '@storefront-ui/vue';
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
    SfInput
  },
  computed: {
    getError () {
      return optionId => {
        const error = get(this.validation.results, 'customOption_' + optionId, {})
        return error
      }
    }
  },
  methods: {
    setupInputFields () {
      for (const customOption of this.product.custom_options) {
        const fieldName = customOptionFieldName(customOption)
        const initValue = defaultCustomOptionValue(customOption)
        this.$set(this.inputValues, fieldName, Array.isArray(initValue) ? [] : String(initValue))
        if (customOption.is_require) { // validation rules are very basic
          this.$set(this.validation.rules, fieldName, 'required') // TODO: add custom validators for the custom options
        }
        this.optionChanged(customOption)
      }
    }
  }
}
</script>
