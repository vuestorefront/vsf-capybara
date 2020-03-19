<template>
  <SfButton
    class="a-add-to-cart sf-button--full-width"
    :disabled="isProductDisabled"
    @click.native="addToCart"
  >
    {{ $t('Add to cart') }}
  </SfButton>
</template>

<script>
import { SfButton } from '@storefront-ui/vue';
import { formatProductMessages } from '@vue-storefront/core/filters/product-messages';
import { notifications } from '@vue-storefront/core/modules/cart/helpers';
import { mapGetters } from 'vuex';

export default {
  name: 'AAddToCart',
  components: {
    SfButton
  },
  props: {
    product: {
      required: true,
      type: Object
    },
    disabled: {
      type: Boolean,
      default: false
    },
    qty: {
      type: Number,
      default: 1
    }
  },
  computed: {
    ...mapGetters({
      isAddingToCart: 'cart/getIsAdding'
    }),
    isProductDisabled () {
      return (
        this.disabled ||
        formatProductMessages(this.product.errors) !== '' ||
        this.isAddingToCart
      );
    }
  },
  methods: {
    async addToCart () {
      try {
        const diffLog = await this.$store.dispatch('cart/addItem', {
          productToAdd: Object.assign({}, this.product, { qty: this.qty })
        });
        diffLog.clientNotifications.forEach(notificationData => {
          this.$store.dispatch(
            'notification/spawnNotification',
            notificationData,
            { root: true }
          );
        });
      } catch (message) {
        this.$store.dispatch(
          'notification/spawnNotification',
          notifications.createNotification({ type: 'danger', message }),
          { root: true }
        );
      }
    }
  }
};
</script>
