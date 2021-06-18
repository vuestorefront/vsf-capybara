<template>
  <div class="m-multiselect">
    <multiselect
      v-model="fValue"
      :options="options"
      :placeholder="placeholder"
      :label="`name`"
      :track-by="`code`"
      :allow-empty="!required"
      @select="$emit('select', $event)"
      @open="fOpen = !fOpen"
      @close="fOpen = !fOpen"
      :show-labels="false"
      :show-pointer="false"
      max-height="175"
      open-direction="below"
    >
      <template #caret>
        <SfChevron class="sf-select__chevron" />
      </template>
    </multiselect>
    <div
      class="m-multiselect__label"
      :class="{ '--required': required, '--compact': isSelected || isOpen }"
      v-if="floatingLabel"
    >
      {{ floatingLabel }}
    </div>
    <div v-if="!valid" class="m-multiselect__error-message">
      <transition name="fade">
        <div v-if="!valid">
          {{ errorMessage }}
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import { SfChevron, SfOverlay } from '@storefront-ui/vue';

export default {
  name: 'MMultiselect',
  components: { Multiselect, SfChevron },
  data () {
    return {
      fValue: {},
      fOpen: false
    };
  },
  props: {
    placeholder: {
      type: String,
      default: ''
    },
    floatingLabel: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
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
      default: 'This field is not correct.'
    }
  },
  computed: {
    isSelected () {
      return this.fValue && Object.keys(this.fValue).length;
    },
    isOpen () {
      return this.fOpen;
    }
  },
  watch: {
    value: {
      handler () {
        if (!this.value) {
          return;
        }

        const option = this.options.find(option => option.code === this.value);

        if (!option) {
          return;
        }

        this.fValue = option;
      },
      immediate: true
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.m-multiselect {
  position: relative;
  box-sizing: border-box;
  align-self: flex-start;
  margin-bottom: var(--spacer-xl);
  ::v-deep .multiselect {
    &__tags {
      border-radius: 0;
      border: none;
      border-bottom: 1px solid var(--c-light);
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
      &:hover {
        background-color: rgba(var(--c-gray-base), 0.1);
      }
    }
    &--active {
      .sf-chevron {
        --chevron-color: var(--c-primary);
      }
      .multiselect__tags {
        border-color: var(--c-primary);
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
    &.--required {
      &::after {
        content: ' *';
        color: var(--c-primary);
      }
    }
    &.--compact {
      font-size: var(--font-2xs);
      top: var(--spacer-2xs);
    }
  }
  @include for-desktop {
    &__label {
      left: calc(var(--spacer-xl));
    }
  }
}
</style>
