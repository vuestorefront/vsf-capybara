<template>
  <button
    type="button"
    class="relative bg-cl-transparent brdr-none inline-flex"
    data-testid="openMicrocart"
    :aria-label="$t('Open microcart')"
    @click="openMicrocart"
  >
    <i class="material-icons">shopping_cart</i>
    <span
      v-cloak
      v-show="totalQuantity"
      class="minicart-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
      data-testid="minicartCount"
    >
      {{ totalQuantity }}
    </span>
  </button>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  computed: {
    ...mapGetters({
      totalQuantity: "cart/getItemsTotalQuantity"
    })
  },
  mounted() {
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        this.$store.dispatch("cart/load");
      }
    });
  },
  methods: {
    ...mapActions({
      openMicrocart: "ui/toggleMicrocart"
    })
  }
};
</script>

<style scoped>
.minicart-count {
  top: 7px;
  left: 50%;
  min-width: 16px;
  min-height: 16px;
  border-radius: 10px;
}
</style>
