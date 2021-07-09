<template>
  <div
    class="m-multiselect"
    :class="{
      '--invalid': !valid,
      '--focused': isOpen
    }"
  >
    <multiselect
      class="_input"
      :id="inputId"
      :value="selectedOption"
      :options="options"
      :placeholder="placeholder"
      :label="labelField"
      :track-by="idField"
      :allow-empty="!required"
      :show-labels="false"
      :show-pointer="true"
      :max-height="190"
      open-direction="below"
      :disabled="disabled"
      @input="onInput"
      @open="isOpen = !isOpen"
      @close="isOpen = !isOpen"
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

let instanceId = 0;

export default Vue.extend({
  name: 'MMultiselect',
  components: {
    Multiselect,
    SfChevron
  },
  data (): Record<string, any> {
    return {
      isOpen: false,
      instanceId: ''
    };
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
      default: 'id'
    },
    labelField: {
      type: String,
      default: 'name'
    },
    value: {
      type: String as PropType<string | undefined>,
      default: undefined
    },
    options: {
      type: Array as PropType<Record<string, any>[]>,
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
    required: {
      type: Boolean,
      default: true
    },
    errorMessage: {
      type: String,
      default: 'This field value is not correct.'
    }
  },
  computed: {
    inputId (): string {
      return 'm-multiselect-' + this.instanceId;
    },
    selectedOption (): Record<string, any> | undefined {
      if (!this.value) {
        return undefined;
      }

      const option = this.options.find(option => option.code === this.value);

      return option;
    }
  },
  methods: {
    onInput ($event: any): void {
      if (!$event) {
        this.$emit('input', undefined)
        this.$emit('change', undefined)
      }

      const valueId = $event[this.idField];

      this.$emit('input', valueId);
      this.$emit('change', valueId);
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

      &::-webkit-scrollbar {
          display: none;
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
}
</style>
