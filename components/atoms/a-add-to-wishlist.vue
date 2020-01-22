<template>
  <SfButton
    class="sf-button--text a-add-to-wishlist"
    data-testid="addToWishlist"
    @click="
      isOnWishlist
        ? removeProductFromWhishList(product)
        : addProductToWhishlist(product)
    "
  >
    {{ !isOnWishlist ? $t("Save for later") : $t("Remove") }}
  </SfButton>
</template>

<script>
import { IsOnWishlist } from '@vue-storefront/core/modules/wishlist/components/IsOnWishlist';
import { AddToWishlist } from '@vue-storefront/core/modules/wishlist/components/AddToWishlist';
import { RemoveFromWishlist } from '@vue-storefront/core/modules/wishlist/components/RemoveFromWishlist';
import i18n from '@vue-storefront/i18n';
import { htmlDecode } from '@vue-storefront/core/lib/store/filters';
import { SfButton } from '@storefront-ui/vue';

export default {
  components: { SfButton },
  mixins: [IsOnWishlist, AddToWishlist, RemoveFromWishlist],
  computed: {
    favoriteIcon () {
      return this.isOnWishlist ? 'favorite' : 'favorite_border';
    }
  },
  methods: {
    addProductToWhishlist (product) {
      this.$store.dispatch(
        'notification/spawnNotification',
        {
          type: 'success',
          message: i18n.t('Product {productName} has been added to wishlist!', {
            productName: htmlDecode(product.name)
          }),
          action1: { label: i18n.t('OK') }
        },
        { root: true }
      );
      this.addToWishlist(product);
    },
    removeProductFromWhishList (product) {
      this.$store.dispatch(
        'notification/spawnNotification',
        {
          type: 'success',
          message: i18n.t(
            'Product {productName} has been removed from wishlist!',
            { productName: htmlDecode(product.name) }
          ),
          action1: { label: i18n.t('OK') }
        },
        { root: true }
      );
      this.removeFromWishlist(product);
    }
  }
};
</script>
