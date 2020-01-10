<template>
  <div class="cart-icon">
    <SfCircleIcon
      icon="empty_cart"
      icon-size="20px"
      icon-color="black"
      class="sf-header__icon"
      role="button"
      :aria-label="$t('Open microcart')"
      @click="openMicrocart"
    />
    <SfBadge v-show="totalQuantity" class="cart-icon__badge"
      >{{ totalQuantity }}
    </SfBadge>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { SfCircleIcon, SfBadge } from "@storefront-ui/vue";

export default {
  components: { SfCircleIcon, SfBadge },
  computed: {
    ...mapGetters({
      totalQuantity: "cart/getItemsTotalQuantity"
    })
  },
  methods: {
    ...mapActions({
      openMicrocart: "ui/toggleMicrocart"
    })
  }
};
</script>

<style lang="scss" scoped>
.cart-icon {
  position: relative;
  &__badge {
    position: absolute;
    bottom: 2.2em;
    left: 4.2em;
    font-size: 0.6em;
    padding: 0.3em 0;
    border-radius: 100%;
    width: 2.2em;
    min-height: 2.2em;
  }
}
</style>
