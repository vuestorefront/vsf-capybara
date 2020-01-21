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

@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}

.a-text-action {
  display: flex;
  margin: $spacer-big 0 ($spacer-big / 2);
}
/* SfAction or SfButton modifier */
.sf-action {
  padding: 0;
  border: 0;
  outline: none;
  background-color: transparent;
  color: $c-text;
  font-family: $body-font-family-secondary;
  font-size: $font-size-regular-mobile;
  font-weight: $body-font-weight-secondary;
  line-height: 1.6;
  text-decoration: underline;
  cursor: pointer;
  @include for-desktop {
    font-size: $font-size-regular-desktop;
  }
}
</style>
