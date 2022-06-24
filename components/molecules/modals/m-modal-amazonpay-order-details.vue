<template>
  <div class="m-modal-amazonpay-order-details">
    <SfModal :visible="isVisible" @close="closeModal">
      <amazon-pay-address-book
        class="amazon-pay-element-container"
        :save-payment-details="true"
        :save-shipping-details="true"
      />
      <amazon-pay-wallet
        class="amazon-pay-element-container"
      />
      <div class="actions">
        <SfButton
          class="sf-button--full-width actions__button color-primary place-order-btn"
          :disabled="isOrderButtonDisabled"
          @click="goToCheckout"
        >
          {{ $t('Place the order') }}
        </SfButton>
      </div>
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
  data () {
    return {
      isOrderButtonDisabled: true
    }
  },
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
  beforeMount () {
    this.$bus.$on('amazon-payment-selected', this.enableOrderButton);
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    goToCheckout () {
      this.closeModal()
      EventBus.$emit(CartEvents.GO_TO_CHECKOUT_FROM_CART)
      this.$router.push(localizedRoute({ name: 'checkout' }))
    },
    enableOrderButton () {
      this.isOrderButtonDisabled = false;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.actions {
    margin-top: var(--spacer-lg);
    &__button {
      margin: var(--spacer-sm) 0;
    }
  }
  .amazon-pay-element-container {
    margin-top: var(--spacer-sm);
  }
</style>
