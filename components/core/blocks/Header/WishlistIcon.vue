<template>
  <button
    type="button"
    class="inline-flex bg-cl-transparent brdr-none relative"
    :aria-label="$t('Open wishlist')"
    @click="toggleWishlistPanel"
  >
    <i class="material-icons">favorite_border</i>
    <span
      v-cloak
      v-show="getWishlistItemsCount"
      class="whishlist-count absolute flex center-xs middle-xs border-box py0 px2 h6 lh16 weight-700 cl-white bg-cl-silver"
    >
      {{ getWishlistItemsCount }}
    </span>
  </button>
</template>

<script>
import WishlistIcon from "@vue-storefront/core/compatibility/components/blocks/Header/WishlistIcon";

export default {
  mixins: [WishlistIcon]
};
</script>

<style scoped>
.whishlist-count {
  top: 7px;
  left: 50%;
  min-width: 16px;
  min-height: 16px;
  border-radius: 10px;
}
</style>
