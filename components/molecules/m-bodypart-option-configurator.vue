<template>
  <div class="m-bodypart-option-configurator">
    <ul class="_visual-selector">
      <li
        class="_visual-selector-value"
        v-for="option in options"
        :key="option.value"
      >
        <input
          :id="getInputId(option)"
          :name="name"
          type="radio"
          :value="option.value"
          :checked="option.isSelected"
          @change="onChange"
        >
        <label
          :for="getInputId(option)"
        >

          <div
            class="_icon"
            :style="getIconStyle(option)"
          />

          <div class="_name">
            {{ option.label }}
          </div>
        </label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { getThumbnailPath } from '@vue-storefront/core/helpers/index';

import BodypartOption from '../interfaces/bodypart-option';

export default Vue.extend({
  name: 'MBodypartOptionConfigurator',
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: Object as PropType<BodypartOption>,
      default: undefined
    },
    type: {
      type: String,
      default: 'product'
    },
    options: {
      type: Array as PropType<BodypartOption[]>,
      default: () => []
    }
  },
  methods: {
    getInputId (option: BodypartOption): string {
      return 'size_value_' + option.id;
    },
    getIconStyle (option: BodypartOption): string {
      const thumb = getThumbnailPath(option.image, 150, 150, this.type);

      return 'background-image: url(' + thumb + ');';
    },
    onChange ($event: any): void {
      const option = this.options.find(option => option.value === $event.target.value);

      this.$emit('input', option);
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-bodypart-option-configurator {
  ._visual-selector {
    list-style: none;
    display: flex;
    justify-content: center;
    padding: 0;
  }

  ._visual-selector-value {
    width: 114px;
    padding: 0 2%;

    ._icon {
      background-position: center center;
      background-repeat: no-repeat;
      background-size: contain;
      border-radius: 50%;
      padding-top: 100%;
      width: 100%;
      position: relative;
      z-index: 0;
    }

    ._name {
      font-size: var(--font-xs);
      font-weight: var(--font-medium);
      margin-top: var(--spacer-sm);
    }
  }

  ._visual-selector-value > input {
      display: block;
      height: 0;
      opacity: 0;
      width: 0;
  }

  ._visual-selector-value > label {
      height: auto;
      margin: 0;
      min-height: 0;
      padding: 0;
      width: 100%;
      cursor: pointer;
  }

  ._visual-selector-value > input:checked + label ._icon::before {
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
  ._visual-selector-value > input:checked + label ._icon::after {
    background: url(/assets/images/sprite/ico-tick-green.png) no-repeat center #fff;
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
</style>
