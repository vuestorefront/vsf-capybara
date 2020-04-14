<template>
  <SfIcon
    size="xs"
    :icon="floatingIcon ? 'add_to_cart' : 'empty_cart'"
    :has-badge="!floatingIcon && totalQuantity"
    :badge-label="totalQuantity"
    class="sf-header__icon a-microcart-icon"
    :class="floatingIcon ? 'sf-bottom-navigation__floating-icon' : 'sf-header__icon'"
    role="button"
    :aria-label="$t('Open microcart')"
    @click="openMicrocart"
  />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { SfIcon } from '@storefront-ui/vue';

export default {
  components: { SfIcon },
  props: {
    floatingIcon: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters({
      totalQuantity: 'cart/getItemsTotalQuantity'
    })
  },
  methods: {
    ...mapActions({
      openMicrocart: 'ui/toggleMicrocart'
    })
  }
};
</script>

<style lang="scss" scoped>
.a-microcart-icon {
  position: relative;
}
.badge {
  position: absolute;
  bottom: 2.2em;
  left: 4.2em;
  font-size: 0.6em;
  padding: 0.3em 0;
  border-radius: 100%;
  width: 2.2em;
  min-height: 2.2em;
}
</style>
