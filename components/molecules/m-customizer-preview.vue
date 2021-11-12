<template>
  <div class="customizer-preview">
    <div class="_side -left">
      <div class="_slot-wrapper" v-show="isFrontOnLeftSide">
        <slot name="frontSmall" />
      </div>

      <div class="_slot-wrapper" v-show="isBackOnLeftSide">
        <slot name="backSmall" />
      </div>

      <div class="_button-wrapper">
        <button class="_flip-button" @click="flipSlots">
          <div class="_flip-button__icon" />
          <div class="_flip-button__inner">
            Flip
          </div>
        </button>
      </div>
    </div>
    <div class="_side -right">
      <div class="_slot-wrapper" v-show="!isBackOnLeftSide">
        <slot name="back" />
      </div>

      <div
        class="_slot-wrapper"
        :class="{ '-hidden': isFrontOnLeftSide }"
      >
        <slot name="front" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'MCustomizerPreview',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    isBackSideFocused: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    isBackOnLeftSide (): boolean {
      return !this.isBackSideFocused;
    },
    isFrontOnLeftSide (): boolean {
      return this.isBackSideFocused;
    }
  },
  methods: {
    flipSlots (): void {
      this.$emit('update:isBackSideFocused', !this.isBackSideFocused);
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.customizer-preview {
    display: flex;
    height: 100%;

    ._slot-wrapper {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        &.-hidden {
            position: absolute;
            top: 0;
            left: 0;
            visibility: hidden;
        }
    }

    ._button-wrapper {
        justify-self: stretch;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-content: center;
    }

    ._side {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;

        &.-left {
            flex: 2;
            margin-right: 0.9em;

            ._slot-wrapper {
                flex-direction: column-reverse;
            }
        }

        &.-right {
            flex: 3;
            justify-content: flex-start;
            margin-left: 0.9em;
            padding-top: 4%;
        }
    }

    ._flip-button {
        background: none;
        color: inherit;
        margin: 0;
        touch-action: manipulation;
        outline: none;
        border: none;
        padding: 1rem 2rem 1.0625rem 2rem;
        font-size: 1rem;
        position: relative;
        cursor: pointer;

        ._flip-button__icon {
            width: 42px;
            height: 42px;
            position: absolute;
            background: url("/assets/images/phrasePillow/arrow.png");
            background-size: cover;
            bottom: 40%;
            right: 0;
        }
    }

    @media (min-width: $tablet-min) {
        ._side {
            &.-left {
                flex: 1;
            }
        }
    }
}
</style>
