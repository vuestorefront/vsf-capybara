<template>
  <div class="a-text-action">
    <SfButton class="sf-button--text" @click="$emit('click')">
      <slot>
        {{ text }}
      </slot>
    </SfButton>
  </div>
</template>
<script>
import { SfButton } from '@storefront-ui/vue';
export default {
  name: 'ATextAction',
  components: {
    SfButton
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
.a-text-action {
  display: flex;
  .sf-button--text {
    --button-color: var(--c-text);
    --button-font-size: var(--font-size-regular);
  }
}
</style>
