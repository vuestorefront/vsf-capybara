<template>
  <div class="m-spinner-button">
    <SfButton :class="buttonClass" :disabled="showSpinner">
      <ALoadingSpinner v-show="showSpinner" />
      <span :style="{visibility: showSpinner ? 'hidden' : 'visible'}">
        <slot />
      </span>
    </SfButton>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { SfButton } from '@storefront-ui/vue';
import ALoadingSpinner from 'theme/components/atoms/a-loading-spinner.vue';

export default Vue.extend({
  name: 'MSpinnerButton',
  props: {
    buttonClass: {
      type: String,
      default: 'color-primary'
    },
    showSpinner: {
      type: Boolean,
      default: false
    }
  },
  components: {
    ALoadingSpinner,
    SfButton
  }
});
</script>

<style lang="scss" scoped>
.m-spinner-button {
  .a-loading-spinner {
    --loader-overlay-background: transparent;
    --loader-spinner-stroke: var(--c-white);
    position: absolute;
    width: var(--font-sm);
    height: var(--font-sm);
  }
}
</style>
