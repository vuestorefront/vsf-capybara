<template>
  <div class="a-text-action">
    <button class="sf-action" @click="$emit('click')">
      <slot>
        {{ text }}
      </slot>
    </button>
  </div>
</template>
<script>
export default {
  name: 'ATextAction',
  props: {
    text: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.a-text-action {
  display: flex;
  margin: var(--spacer-big) 0 (var(--spacer-big) / 2);
}
/* SfAction or SfButton modifier */
.sf-action {
  padding: 0;
  border: 0;
  outline: none;
  background-color: transparent;
  color: var(--c-text);
  font-family: var(--body-font-family-secondary);
  font-size: var(--font-size-regular);
  font-weight: var(--body-font-weight-secondary);
  line-height: 1.6;
  text-decoration: underline;
  cursor: pointer;
}
</style>
