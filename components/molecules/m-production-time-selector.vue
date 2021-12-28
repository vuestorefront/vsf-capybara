<template>
  <div
    class="m-production-time-selector"
    v-if="isProductionOptionsAvailable"
  >
    <validation-provider
      v-slot="{ errors, classes }"
      name="Production time"
      slim
    >
      <div
        class="_production-time-field"
        :class="classes"
      >
        <SfHeading
          :level="3"
          :title="$t('Choose your production time')"
        />

        <MBlockStory
          v-if="blockSlug"
          :story-slug="blockSlug"
        />

        <SfSelect
          v-model="selectedOption"
          name="rush_addons"
          class="_rush-addons"
          :disabled="disabled"
          :valid="!errors.length"
          :error-message="errors[0]"
        >
          <SfSelectOption
            v-for="option in productionTimeOptions"
            :key="option.id"
            :value="option"
          >
            {{ option.text }}
          </SfSelectOption>
        </SfSelect>
      </div>
    </validation-provider>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import {
  SfHeading,
  SfSelect
} from '@storefront-ui/vue';
import ProductionTimeOption from '../interfaces/production-time-option.interface';
import MBlockStory from 'theme/components/molecules/m-block-story.vue';

export default Vue.extend({
  name: 'MProductionTimeSelector',
  components: {
    ValidationProvider,
    SfHeading,
    SfSelect,
    MBlockStory
  },
  props: {
    value: {
      type: Object as PropType<ProductionTimeOption> | undefined,
      default: undefined
    },
    productionTimeOptions: {
      type: Array as PropType<ProductionTimeOption[]>,
      required: true
    },
    productId: {
      type: Number as PropType<number>,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    selectedOption: {
      get (): ProductionTimeOption | undefined {
        return this.value;
      },
      set (value: ProductionTimeOption): void {
        this.$emit('input', value);
      }
    },
    isProductionOptionsAvailable (): boolean {
      return this.productionTimeOptions.length !== 0;
    },
    blockSlug (): string | undefined {
      switch (this.productId) {
        case 73:
        case 74:
        case 75:
          return 'forevers_creation_page_production_time'
        case 253:
          return 'pillow_creation_page_production_time'
        default:
          return undefined
      }
    }
  }
});
</script>

<style lang="scss" scoped>

.m-production-time-selector {
  ._production-time-field {
    max-width: 47em;
    margin-left: auto;
    margin-right: auto;
    margin-top: var(--spacer-xl);
    text-align: center;

    ::v-deep .sf-select__selected {
      justify-content: center;
    }
  }
}
</style>
