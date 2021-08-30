<template>
  <div
    class="m-multiselect"
    :class="{
      '--invalid': !valid,
      '--focused': isOpen
    }"
    @keydown.enter.capture="onEnterPressed"
  >
    <multiselect
      class="_input"
      :id="inputId"
      v-model="selectedOption"
      :options="allOptions"
      :placeholder="placeholder"
      :label="labelField"
      :track-by="idField"
      :allow-empty="!required"
      :show-labels="false"
      :show-pointer="true"
      :preserve-search="shouldPreserveSearch"
      :max-height="190"
      open-direction="below"
      :disabled="disabled"
      ref="multiselect"
      @open="isOpen = !isOpen"
      @close="onClose"
    >
      <template #caret>
        <SfChevron class="sf-select__chevron" />
      </template>
    </multiselect>

    <label
      :for="inputId"
      class="m-multiselect__label"
      :class="{
        '--required': required,
        '--compact': selectedOption || isOpen
      }"
      v-if="label"
    >
      {{ label }}
    </label>

    <div v-if="!valid" class="m-multiselect__error-message">
      <transition name="fade">
        <div v-if="!valid">
          {{ errorMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import Multiselect from 'vue-multiselect';
import { SfChevron } from '@storefront-ui/vue';

type Option = Record<string, any> | string;

let instanceId = 0;

export default Vue.extend({
  name: 'MMultiselect',
  inheritAttrs: false,
  components: {
    Multiselect,
    SfChevron
  },
  created: function (): void {
    this.instanceId = instanceId.toString();
    instanceId += 1;
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    idField: {
      type: String,
      default: undefined
    },
    labelField: {
      type: String,
      default: undefined
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    options: {
      type: Array as PropType<Option[]>,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    },
    valid: {
      type: Boolean,
      default: true
    },
    allowFreeText: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: true
    },
    errorMessage: {
      type: String,
      default: 'This field value is not correct.'
    }
  },
  data () {
    return {
      isOpen: false,
      instanceId: '',
      customOptions: [] as Option[]
    }
  },
  computed: {
    selectedOption: {
      get (): Option | undefined {
        if (!this.value) {
          return undefined;
        }

        const option = this.allOptions.find(option => {
          if (this.idField && typeof option === 'object') {
            return option[this.idField] === this.value
          } else {
            return option === this.value
          }
        });

        return option;
      },
      set (value: Option | undefined): void {
        if (!value) {
          this.$emit('input', undefined)
          this.$emit('change', undefined)
        }

        let valueId;
        if (!this.idField || typeof value !== 'object') {
          valueId = value;
        } else {
          valueId = value[this.idField];
        }

        this.$emit('input', valueId);
        this.$emit('change', valueId);
      }
    },
    inputId (): string {
      return 'm-multiselect-' + this.instanceId;
    },
    allOptions (): any[] {
      const result = [...this.customOptions, ...this.options];

      result.sort((a, b) => {
        if (typeof a === 'string' && b === 'string') {
          return a.localeCompare(b);
        } else if (typeof a !== 'string' && typeof b !== 'string') {
          return a[this.labelField].localeCompare(b[this.labelField])
        }
      });

      return result;
    },
    shouldPreserveSearch (): boolean {
      return this.allowFreeText;
    }
  },
  methods: {
    getMultiselect (): Multiselect | undefined {
      return this.$refs['multiselect'] as Multiselect | undefined;
    },
    processFreeText (): Option | undefined {
      const multiselect = this.getMultiselect();
      if (!multiselect) {
        return;
      }

      const searchValue: string = (multiselect as any).search;

      if (!searchValue ||
        (multiselect as any).filteredOptions.length
      ) {
        return;
      }

      let option: Option = searchValue;
      if (this.idField && this.labelField) {
        option = {
          [this.idField]: searchValue,
          [this.labelField]: searchValue
        };
      }

      this.customOptions.push(option);
      return option;
    },
    onClose (): void {
      this.isOpen = !this.isOpen;

      if (!this.allowFreeText) {
        return;
      }

      const newOption = this.processFreeText();
      if (!newOption) {
        return;
      }

      this.selectedOption = newOption;
    },
    async onEnterPressed (): Promise<void> {
      if (!this.allowFreeText) {
        return;
      }

      this.processFreeText();
    }
  }
});
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "~@storefront-ui/shared/styles/helpers/typography";
@import "~@storefront-ui/shared/styles/helpers/layout";

.m-multiselect {
  position: relative;
  box-sizing: border-box;
  align-self: flex-start;

  ::v-deep .multiselect {
    &__tags {
      border-radius: 0;
      border: none;
      @include border(--input-border, 0 0 1px 0, solid, var(--c-light));
      min-height: 49px;
      padding-left: 0;
      padding-top: var(--spacer-sm);
      background: none;
    }

    &__content-wrapper {
      z-index: 1;
      overflow-x: hidden;
      -ms-overflow-style: none;
      scrollbar-width: none;
      overflow-y: scroll;
      border: none;
      border-radius: 0;
      box-shadow: 0 4px 11px rgba(var(--c-dark-base), 0.1);

      // For Firefox
      scrollbar-color: var(--c-dark-variant) var(--c-white);
      scrollbar-width: thin;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-thumb {
          border-radius: 1em;
          background: var(--c-dark-variant);
      }
    }

    &__input, &__single {
      margin-bottom: 0;
      min-height: 32px;
      font-size: var(--font-lg);
      font-weight: var(--font-normal);
      background: none;
      padding: 0;
    }

    &__option {
      white-space: normal;
      padding: calc(var(--spacer-xs) * 1.1);
      border-bottom: 1px solid var(--c-light);
      min-height: 20px;
      font-size: var(--font-sm);

      &--selected {
        background-color: var(--c-light);
        font-weight: var(--font-normal);
      }

      &--highlight {
        background-color: rgba(var(--c-gray-base), 0.1);
        color: inherit;
      }
    }

    &--active {
      .sf-chevron {
        --chevron-color: var(--input-border-color);
      }
      .multiselect__tags {
        border-color: var(--input-border-color);
      }
    }
  }

  &__label {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate3d(0, calc(50% * -1), 0);
    transition: top 150ms linear, font-size 150ms linear;
    font-size: var(--font-lg);
    color: var(--input-label-color, inherit);

    &.--required {
      &::after {
        content: ' *';
        color: var(--input-label-color, var(--c-primary));
      }
    }

    &.--compact {
      font-size: var(--font-2xs);
      top: var(--spacer-2xs);
    }
  }

  ._input {
    margin: var(--input-margin, 0 0 var(--spacer-xs) 0);
  }

  &__error-message {
    color: var(--input-error-message-color, var(--c-danger));
    height: calc(var(--font-xs) * 1.2);
    @include font(
      --input-error-message-font,
      var(--font-medium),
      var(--font-xs),
      1.2,
      var(--font-family-secondary)
    );
  }

  &.--focused {
    --input-border-color: var(--c-primary);
    --input-label-color: var(--c-primary);

    .m-multiselect__label {

    }
  }

  &.--invalid {
    --input-border-color: var(--c-danger);

    &.--focused {
      --input-label-color: var(--c-danger);
    }
  }

  @include for-desktop {
    margin: 0 0 var(--spacer-sm) 0;

    &__label {
      left: calc(var(--spacer-xl));
    }
  }

  @media (prefers-color-scheme: dark) {
    // Hack for detect iOS Safari
    @supports (-webkit-touch-callout: none) {
      --primary-color: #cacaca;
      --secondary-color: #e0e0e1;

      ::v-deep .multiselect {

        .multiselect__content-wrapper {
          background-color: var(--primary-color);
        }

        .multiselect__option {
          background-color: var(--primary-color);
          border-color: var(--secondary-color);

          &.multiselect__option--highlight {
            background-color: var(--secondary-color);
          }
        }
      }
    }
  }
}
</style>
