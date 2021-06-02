<template>
  <SfButton
    class="sf-button--pure a-microcart-icon"
    @click="openDetailedCart"
  >
    <SfIcon
      size="xs"
      :icon="floatingIcon ? 'add_to_cart' : 'empty_cart'"
      :class="floatingIcon ? 'sf-bottom-navigation__floating-icon' : 'sf-header__icon'"
      :aria-label="$t('Open Cart')"
    >
      <template #badge>
        <SfBadge v-show="!floatingIcon && totalQuantity" class="sf-icon__badge sf-badge--number">
          {{ totalQuantity }}
        </SfBadge>
      </template>
    </SfIcon>
  </SfButton>
</template>

<script>
import { mapGetters } from 'vuex';
import { SfIcon, SfButton, SfBadge } from '@storefront-ui/vue';

export default {
  components: { SfIcon, SfButton, SfBadge },
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
    openDetailedCart () {
      this.$router.push({ name: 'detailed-cart' })
    }
  }
};
</script>

<style lang="scss" scoped>
.a-detailed-cart-icon {
  position: relative;
  .sf-header__icon {
    cursor: pointer;
  }
}
</style>
