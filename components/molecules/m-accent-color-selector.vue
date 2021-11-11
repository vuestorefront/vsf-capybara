<template>
  <div class="m-accent-color-selector" :class="skinClass">
    <ul name="accent-colors" class="_selector-container">
      <li
        v-for="option in accentColorPartValues"
        :key="option.id"
        class="_option-value"
      >
        <input
          :id="'accent-color-' + option.id"
          type="radio"
          name="accent-color-option"
          :value="option"
          v-model="selectedOption"
          :disabled="disabled"
        >

        <label class="_value-representation" :for="'accent-color-' + option.id">
          <div class="_icon-wrapper">
            <div
              class="_icon"
              :style="{ 'background-color': option.background }"
            />
          </div>

          <div class="_name">{{ option.title }}</div>
        </label>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import AccentColorPart from '../interfaces/accent-color-part.interface';

export default Vue.extend({
  name: 'MAccentColorSelector',
  props: {
    value: {
      type: Object as PropType<AccentColorPart | undefined>,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accentColorPartValues: {
      type: Array as PropType<AccentColorPart[]>,
      required: true
    }
  },
  computed: {
    skinClass (): string {
      return `-skin-petsies`;
    },
    selectedOption: {
      get (): AccentColorPart | undefined {
        return this.value;
      },
      set (value: AccentColorPart): void {
        this.$emit('input', value);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-accent-color-selector {
  ._selector-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    margin: -0.5em -0.25em;
    overflow: hidden;
    padding: 0;
  }

  ._option-value {
    flex-shrink: 0;
    flex-grow: 0;
    display: block;
    margin: 0.25em 0.5em;
    width: calc(25% - 1em);

    ._value-representation {
      background: none;
      line-height: inherit;
      margin: 0;
      min-height: 0;
      padding: 0;
      width: 100%;
      cursor: pointer;
    }

    ._name {
      font-size: 0.86em;
      line-height: 1.2;
      margin-top: 0.2em;
      text-align: center;
      word-wrap: break-word;
    }

    ._icon-wrapper {
      border: 3px solid transparent;
      display: block;

      ._icon {
        background-position: center center;
        background-repeat: no-repeat;
        background-size: cover;
        padding-top: 100%;
        width: 100%;
      }
    }
  }

  ._option-value input[type="radio"] {
    display: block;
    height: 0;
    opacity: 0;
    width: 0;
    padding: 0;
    margin: 0;

    &:checked + ._value-representation {
      background: none;
    }

    &:disabled + ._value-representation {
      background: none;
      opacity: 0.6;
    }
  }

  @media (min-width: $tablet-min) {
    ._option-value {
      width: 72px;
    }
  }

  &.-skin-petsies {
    ._option-value input[type="radio"] {
      &:checked + ._value-representation {
        ._icon-wrapper {
          border-color: var(--c-primary);
        }
      }
    }
  }
}
</style>
