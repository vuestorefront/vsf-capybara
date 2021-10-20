<template>
  <div
    class="m-bodypart-option-configurator"
    :class="{ '-disabled': disabled }"
  >
    <ul class="_visual-selector">
      <li
        class="_visual-selector-value"
        :class="{'-color-value': isColorValue(option)}"
        v-for="option in options"
        :key="option.value"
      >
        <input
          :id="getInputId(option)"
          :name="name"
          :type="inputType"
          :value="option"
          v-model="selectedOption"
          :disabled="disabled"
          @click="(event) => onChange(event, option)"
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

import { BodyPartValueContentType } from 'src/modules/budsies';

import BodypartOption from '../interfaces/bodypart-option';

let instanceId = 0;

export default Vue.extend({
  name: 'MBodypartOptionConfigurator',
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: [Array, Object] as PropType<BodypartOption | BodypartOption[]>,
      default: undefined
    },
    maxValues: {
      type: Number,
      default: 1
    },
    type: {
      type: String,
      default: 'product'
    },
    options: {
      type: Array as PropType<BodypartOption[]>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data (): Record<string, any> {
    return {
      instanceId: ''
    };
  },
  computed: {
    selectedOption: {
      get (): BodypartOption | BodypartOption[] {
        if (this.inputType === 'checkbox' && this.value === undefined) {
          return [];
        }

        if (this.inputType !== 'checkbox' && Array.isArray(this.value)) {
          return this.value[0];
        }

        return this.value;
      },
      set (value: BodypartOption | BodypartOption[]): void {
        this.$emit('input', value);
      }
    },
    inputType (): 'checkbox' | 'radio' {
      return this.maxValues > 1 ? 'checkbox' : 'radio';
    }
  },
  created: function (): void {
    this.instanceId = instanceId.toString();
    instanceId += 1;
  },
  methods: {
    isColorValue (option: BodypartOption): boolean {
      return option.contentTypeId === BodyPartValueContentType.COLOR;
    },
    getInputId (option: BodypartOption): string {
      return `body_part_value_${this.instanceId}_${option.id}`;
    },
    getIconStyle (option: BodypartOption): string | Record<string, string | number> {
      if (option.contentTypeId === BodyPartValueContentType.IMAGE && option.image) {
        const thumb = getThumbnailPath(option.image, 150, 150, this.type);
        return {
          'background-image': `url(${thumb})`
        }
      }

      if (option.contentTypeId === BodyPartValueContentType.COLOR && option.color) {
        return {
          'background-color': option.color
        }
      }

      return '';
    },
    onChange (event: Event, option: BodypartOption): void {
      if (!Array.isArray(this.selectedOption)) {
        return;
      }

      const existingItem = this.selectedOption.find(item => item.value === option.value);
      if (existingItem) {
        return;
      }

      if (this.selectedOption.length < this.maxValues) {
        return;
      }

      event.preventDefault();
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
    flex-wrap: wrap;
    justify-content: center;
    padding: 0;
    row-gap: 2vw;
    column-gap: 4%;
  }

  ._visual-selector-value {
    width: 114px;

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

    &.-color-value {
      width: 60px;

      ._icon {
        border: 1px solid #ccc;
      }
    }
  }

  ._visual-selector-value > input {
      display: block;
      height: 0;
      opacity: 0;
      width: 0;
      margin: 0;
      padding: 0;
      border: 0;
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

  &.-disabled {
    ._visual-selector-value {
      opacity: 0.7;
    }
  }
}
</style>
