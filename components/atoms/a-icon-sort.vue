<template>
  <SfIcon :size="size" :style="styles" class="a-icon-sort">
    <svg viewBox="0 0 12 16" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8.32809 15.2897L12 11.7644V12.2892L8.13547 16L4.27094 12.2892V11.7644L7.94285 15.2897V6.83165H8.32809L8.32809 15.2897ZM3.67191 0.710288L0 4.23556V3.71082L3.86453 0L7.72906 3.71082V4.23556L4.05715 0.710288V9.16835H3.67191L3.67191 0.710288Z"
      />
    </svg>
  </SfIcon>
</template>

<script>
import { SfIcon } from "@storefront-ui/vue";

export default {
  name: "IconSort",
  components: { SfIcon },
  props: {
    size: {
      type: String,
      default: "",
      required: false
    },
    styles: {
      type: String,
      default: "",
      required: false
    }
  }
};
</script>
