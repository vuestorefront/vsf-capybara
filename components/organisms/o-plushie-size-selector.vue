<template>
  <div class="o-plushie-size-selector" :class="{'-disabled': disabled}">
    <ul class="_selector">
      <li class="_selector-value"
          v-for="option in options"
          :key="option.optionId"
      >
        <input
          :id="inputIdDictionary[option.optionId]"
          type="radio"
          v-model="selectedOption"
          :disabled="disabled"
        >
        <label :for="inputIdDictionary[option.optionId]">
          <div class="_icon -most-popular" v-if="showMostPopularIconForOption(option)" />
          <div class="_icon" :style="iconStyleDictionary[option.optionId]" />

          <div class="_title">
            {{ optionTitleDictionary[option.optionId] }}
          </div>

          <div class="_price-delta" v-if="priceDeltaDictionary[option.optionId]">
            {{ priceDeltaDictionary[option.optionId] }}
          </div>

        </label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { getThumbnailPath } from '@vue-storefront/core/helpers';
import Vue, { PropType } from 'vue'
import { Dictionary } from 'vue-router/types/router';

import SizeOption from '../interfaces/size-option'

const SIZE_ITEM_WIDTH = 145;

export default Vue.extend({
  props: {
    value: {
      type: Object as PropType<SizeOption> | undefined,
      default: undefined
    },
    showFullPrice: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    showMostPopularIcon: {
      type: Boolean as PropType<boolean>,
      default: false
    },
    options: {
      type: Array as PropType<SizeOption[]>,
      required: true
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false
    }
  },
  computed: {
    baseSizeOption (): SizeOption | undefined {
      if (!this.options.length) {
        return;
      }

      return this.options[0];
    },
    iconStyleDictionary (): Dictionary<Dictionary<string>> {
      const iconStyleDictionary: Dictionary<Dictionary<string>> = {};

      this.options.forEach((option) => {
        const thumb = getThumbnailPath(option.image, SIZE_ITEM_WIDTH * 2, SIZE_ITEM_WIDTH * 2, 'product');
        iconStyleDictionary[option.optionId] = {
          'background-image': `url(${thumb})`
        }
      });

      return iconStyleDictionary;
    },
    inputIdDictionary (): Dictionary<string> {
      const inputIdDictionary: Dictionary<string> = {};

      this.options.forEach((option) => {
        inputIdDictionary[option.optionValueId] = `size_option_${option.optionId}`;
      });

      return inputIdDictionary;
    },
    optionTitleDictionary (): Dictionary<string> {
      const optionTitleDictionary: Dictionary<string> = {};

      this.options.forEach((option) => {
        if (this.isShowFullPrice(option)) {
          optionTitleDictionary[option.optionId] = `${option.name} - $${option.finalPrice.toString()}`;
        } else {
          optionTitleDictionary[option.optionId] = option.name;
        }
      });

      return optionTitleDictionary;
    },
    priceDeltaDictionary (): Dictionary<string> {
      const priceDeltaDictionary: Dictionary<string> = {};

      this.options.forEach((option) => {
        if (this.showFullPrice(option)) {
          return;
        }

        const priceDiff =
            option.finalPrice - this.baseSizeOption.finalPrice;
        priceDeltaDictionary[option.optionId] = `${(priceDiff < 0 ? ' -$' : ' +$')}${Math.abs(priceDiff).toString()}`;
      })

      return priceDeltaDictionary;
    },
    selectedOption: {
      get (): SizeOption {
        return this.value;
      },
      set (value: SizeOption): void {
        this.$emit('input', value);
      }
    }

  },
  methods: {
    isShowFullPrice (sizeOption: SizeOption): boolean {
      return this.showFullPrices || this.baseSizeOption === sizeOption;
    },
    onSizeSelect (selectedSize: SizeOption): void {
      this.$emit('input', selectedSize);
    },
    showMostPopularIconForOption (option: SizeOption): boolean {
      return true;
    }
  }
})
</script>

<style lang="scss" scoped>
.o-plushie-size-selector {

}
</style>
