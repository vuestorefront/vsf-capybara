<template>
  <div class="m-plushie-size-selector" :class="{'-disabled': disabled}">
    <ul class="_selector">
      <li class="_selector-value"
          v-for="option in options"
          :key="option.id"
      >
        <input
          :id="inputIdDictionary[option.id]"
          type="radio"
          v-model="selectedOption"
          :value="option"
          :disabled="disabled"
        >
        <label :for="inputIdDictionary[option.id]">
          <div
            class="_icon"
            :style="iconStyleDictionary[option.id]"
          >
            <div class="_most-popular" v-if="showMostPopularIconForOption(option)" />
          </div>

          <div class="_title">
            {{ optionTitleDictionary[option.id] }}

            <div class="_price-delta" v-if="priceDeltaDictionary[option.id]">
              {{ priceDeltaDictionary[option.id] }}
            </div>
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
  name: 'MPlushieSizeSelector',
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
        if (!option.image) {
          return;
        }

        const thumb = getThumbnailPath(option.image, SIZE_ITEM_WIDTH * 2, SIZE_ITEM_WIDTH * 2, 'product');
        iconStyleDictionary[option.id] = {
          'background-image': `url(${thumb})`
        }
      });

      return iconStyleDictionary;
    },
    inputIdDictionary (): Dictionary<string> {
      const inputIdDictionary: Dictionary<string> = {};

      this.options.forEach((option) => {
        inputIdDictionary[option.id] = `size_option_${option.id}`;
      });

      return inputIdDictionary;
    },
    optionTitleDictionary (): Dictionary<string> {
      const optionTitleDictionary: Dictionary<string> = {};

      this.options.forEach((option) => {
        if (this.isShowFullPrice(option)) {
          optionTitleDictionary[option.id] = `${option.label} - $${option.finalPrice.toString()}`;
        } else {
          optionTitleDictionary[option.id] = option.label;
        }
      });

      return optionTitleDictionary;
    },
    priceDeltaDictionary (): Dictionary<string> {
      const priceDeltaDictionary: Dictionary<string> = {};

      this.options.forEach((option) => {
        if (this.isShowFullPrice(option) || !this.baseSizeOption) {
          return;
        }

        const priceDiff =
            option.finalPrice - this.baseSizeOption.finalPrice;
        priceDeltaDictionary[option.id] = `${(priceDiff < 0 ? ' -$' : ' +$')}${Math.abs(priceDiff).toString()}`;
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
    isMediumSizeOption (option: SizeOption): boolean {
      return option.value.indexOf('medium') !== -1;
    },
    isShowFullPrice (option: SizeOption): boolean {
      return this.showFullPrice || !this.baseSizeOption || this.baseSizeOption.id === option.id;
    },
    showMostPopularIconForOption (option: SizeOption): boolean {
      return this.showMostPopularIcon && this.isMediumSizeOption(option);
    }
  }
})
</script>

<style lang="scss" scoped>
$size-item-width: 145px;

.m-plushie-size-selector {
  ._selector {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
    row-gap: 2vw;
  }

  ._selector-value {
    box-sizing: border-box;
    width: 33.33%;
    padding: 0 2%;
    max-width: $size-item-width;

    ._icon {
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
      border-radius: 50%;
      padding-top: 100%;
      width: 100%;
      position: relative;
      z-index: 0;

      ._most-popular {
        position: absolute;
        width: 100%;
        top: 0;
        right: 0;

        &::after {
          background: url('/assets/images/most-popular.png') no-repeat center;
          background-size: contain;
          border: none;
          border-radius: 100%;
          content: "";
          height: 70px;
          position: absolute;
          right: -20px;
          top: -15px;
          width: 70px;
          z-index: 3;
        }
      }
    }

    ._title {
      font-size: var(--font-xs);
      font-weight: var(--font-medium);
      margin-top: var(--spacer-sm);

      ._price-delta {
        color: var(--c-primary);
        margin-top: var(--spacer-2xs);
      }
    }

    > input {
      display: block;
      height: 0;
      opacity: 0;
      width: 0;
      margin: 0;
      padding: 0;
      border: 0;
    }

    > label {
      height: auto;
      margin: 0;
      min-height: 0;
      padding: 0;
      width: 100%;
      cursor: pointer;
    }

    > input:checked + label ._icon::before {
      background: rgba(52, 184, 147, 0.7);
      border-radius: 100%;
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      width: 100%;
      z-index: 1;
    }

    > input:checked + label ._icon::after {
      background: url('/assets/images/sprite/ico-tick-green.png') no-repeat center #fff;
      border: 2px solid #38b677;
      border-radius: 100%;
      content: "";
      height: 24px;
      position: absolute;
      right: 0;
      top: 0;
      width: 24px;
      z-index: 2;
    }
  }

  &.-disabled {
    ._selector-value {
      opacity: 0.7;

      > label {
       cursor: default;
      }
    }
  }
}
</style>
