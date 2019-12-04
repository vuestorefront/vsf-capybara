<template>
  <button
    type="button"
    class="inline-flex brdr-none"
    data-testid="returnButton"
    @click="goBack"
  >
    <i class="material-icons">keyboard_backspace</i>
  </button>
</template>

<script>
import ReturnIcon from "@vue-storefront/core/compatibility/components/blocks/Header/ReturnIcon";

export default {
  mixins: [ReturnIcon]
};
</script>
