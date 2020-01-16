<template>
  <SfIcon :size="size" :style="styles" class="a-icon-view-grid">
    <svg viewBox="0 0 10 10">
      <rect width="2" height="2" fill="#1D1F22" />
      <rect y="4" width="2" height="2" fill="#1D1F22" />
      <rect y="8" width="2" height="2" fill="#1D1F22" />
      <rect x="4" width="2" height="2" fill="#1D1F22" />
      <rect x="4" y="4" width="2" height="2" fill="#1D1F22" />
      <rect x="4" y="8" width="2" height="2" fill="#1D1F22" />
      <rect x="8" width="2" height="2" fill="#1D1F22" />
      <rect x="8" y="4" width="2" height="2" fill="#1D1F22" />
      <rect x="8" y="8" width="2" height="2" fill="#1D1F22" />
    </svg>
  </SfIcon>
</template>

<script>
import { SfIcon } from '@storefront-ui/vue';

export default {
  name: 'IconViewGrid',
  components: { SfIcon },
  props: {
    size: {
      type: String,
      default: '',
      required: false
    },
    styles: {
      type: String,
      default: '',
      required: false
    }
  }
};
</script>
