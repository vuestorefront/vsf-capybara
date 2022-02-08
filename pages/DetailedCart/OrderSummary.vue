<template>
  <div class="detailed-cart-order-summary">
    <SfHeading
      title="Totals"
      :level="2"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <MPriceSummary :is-large="true" />
    <div class="_total-notes">
      All pricing in USD
    </div>
    <div class="actions">
      <APromoCode :allow-promo-code-removal="false" />
      <SfButton
        class="sf-button--full-width actions__button"
        @click="goToCheckout"
      >
        Go to checkout
      </SfButton>
      <amazon-pay-button
        type="PwA"
      />
      <amazon-pay-order-details-modal />
    </div>
    <SfLoader v-if="isUpdatingQuantity" :loading="isUpdatingQuantity" />
  </div>
</template>
<script>
import {
  SfLoader,
  SfHeading,
  SfButton
} from '@storefront-ui/vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import EventBus from '@vue-storefront/core/compatibility/plugins/event-bus';

import CartEvents from 'src/modules/shared/types/cart-events';

import APromoCode from 'theme/components/atoms/a-promo-code.vue';
import MPriceSummary from 'theme/components/molecules/m-price-summary.vue';
import AmazonPayButton from 'src/modules/vsf-amazon-pay/components/Button.vue'
import AmazonPayOrderDetailsModal from 'theme/components/molecules/modals/m-modal-amazonpay-order-details.vue'
import { mapActions } from 'vuex'
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'OrderSummary',
  components: {
    MPriceSummary,
    SfLoader,
    APromoCode,
    SfHeading,
    SfButton,
    AmazonPayButton,
    AmazonPayOrderDetailsModal
  },
  props: {
    isUpdatingQuantity: {
      type: Boolean,
      required: true
    }
  },
  beforeMount () {
    this.$bus.$on('amazon-authorized', this.onAmazonPayAuthorized);
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    goToCheckout () {
      EventBus.$emit(CartEvents.GO_TO_CHECKOUT_FROM_CART)
      this.$router.push(localizedRoute({ name: 'checkout' }));
    },
    onAmazonPayAuthorized () {
      this.openModal({ name: ModalList.AmazonPayOrderDetails });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.detailed-cart-order-summary {
  position: relative;
  background: var(--c-light);
  padding: var(--spacer-xl);

  .title {
    @include for-desktop {
      --heading-title-margin: 0 0 var(--spacer-2xl) 0;
      --heading-title-font-size: var(--h3-font-size);
      --heading-title-font-weight: var(--font-semibold);
    }
  }
  ._total-notes{
    text-align: right;
    font-size: var(--font-sm);

    @include for-desktop {
      font-size: var(--font-base);
    }
  }
  .actions {
    margin-top: var(--spacer-lg);
    &__button {
      margin: var(--spacer-sm) 0;
      &--secondary {
        margin: 0 0 0 var(--spacer-xs);
        text-align: left;
      }
    }
  }
  .promo-code {
    padding: 0;
  }
  .sf-loader {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.5;
  }
}
</style>
