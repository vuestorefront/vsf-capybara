<template>
  <div
    class="m-production-time-selector"
    v-if="isProductionOptionsAvailable"
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
      :should-lock-scroll-on-open="isMobile"
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
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ValidationProvider } from 'vee-validate';
import {
  SfHeading,
  SfSelect
} from '@storefront-ui/vue';
import {
  mapMobileObserver,
  unMapMobileObserver
} from '@storefront-ui/vue/src/utilities/mobile-observer';

import MBlockStory from 'theme/components/molecules/m-block-story.vue';

import ProductionTimeOption from '../interfaces/production-time-option.interface';

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
    ...mapMobileObserver(),
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
  },
  beforeDestroy () {
    unMapMobileObserver();
  }
});
</script>

<style lang="scss" scoped>

.m-production-time-selector {
  max-width: 47em;
  margin-left: auto;
  margin-right: auto;
  margin-top: var(--spacer-xl);
  text-align: center;

  ::v-deep .sf-select__selected {
    justify-content: center;
  }
}
</style>
