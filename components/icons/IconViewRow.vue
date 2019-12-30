<template>
  <SfIcon :size="size" :style="style">
    <svg viewBox="0 0 11 10" fill="none">
      <rect width="11" height="2" fill="#BEBFC4" />
      <rect y="8" width="11" height="2" fill="#BEBFC4" />
      <rect y="4" width="7" height="2" fill="#BEBFC4" />
    </svg>
  </SfIcon>
</template>

<script>
import { SfIcon } from "@storefront-ui/vue";

export default {
  name: "IconViewRow",
  components: { SfIcon },
  props: {
    size: {
      type: String,
      default: "",
      required: false
    },
    style: {
      type: String,
      default: "",
      required: false
    }
  }
};
</script>
