<template>
  <div class="a-wishlist-icon">
    <SfCircleIcon
      icon="heart"
      icon-size="xs"
      class="sf-header__circle-icon"
      role="button"
      aria-label="wishlist"
      @click="toggleWishlistPanel"
    />
    <SfBadge v-show="getWishlistItemsCount" class="badge">
      {{ getWishlistItemsCount }}
    </SfBadge>
  </div>
</template>

<script>
import WishlistIcon from '@vue-storefront/core/compatibility/components/blocks/Header/WishlistIcon';
import { SfCircleIcon, SfBadge } from '@storefront-ui/vue';

export default {
  components: { SfCircleIcon, SfBadge },
  mixins: [WishlistIcon]
};
</script>

<style lang="scss" scoped>
.a-wishlist-icon {
  position: relative;
}
.badge {
  position: absolute;
  bottom: 2.2em;
  left: 4.2em;
  font-size: var(--font-2xs);
  padding: var(--spacer-2xs) 0;
  border-radius: 100%;
  width: 2.2em;
  min-height: 2.2em;
}
</style>
