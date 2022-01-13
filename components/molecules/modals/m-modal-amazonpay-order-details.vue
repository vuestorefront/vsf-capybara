<template>
  <div class="m-modal-amazonpay-order-details">
    <SfModal :visible="isVisible" @close="closeModal">
      <amazon-pay-address-book
        save-payment-details="true"
        save-shipping-details="true"
      />
      <amazon-pay-wallet />
      <SfButton
        class="sf-button--full-width actions__button place-order-btn"
        @click="goToCheckout"
      >
        {{ $t("Place the order") }}
      </SfButton>
    </SfModal>
  </div>
</template>

<script>

import { SfModal, SfButton } from '@storefront-ui/vue';
import { mapActions } from 'vuex';
import AmazonPayAddressBook from 'src/modules/vsf-amazon-pay/components/AddressBook.vue';
import AmazonPayWallet from 'src/modules/vsf-amazon-pay/components/Wallet.vue';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus';
import CartEvents from 'src/modules/shared/types/cart-events';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';

export default {
  name: 'AmazonPayOrderDetailsModal',
  components: { SfModal, SfButton, AmazonPayAddressBook, AmazonPayWallet },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
      required: false
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: false
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    goToCheckout () {
      EventBus.$emit(CartEvents.GO_TO_CHECKOUT_FROM_CART)
      this.$router.push(localizedRoute('/checkout'));
    }
  }
};
</script>
