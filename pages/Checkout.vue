<template>
  <div id="checkout">
    <div v-if="!isThankYouPage" class="checkout">
      <div class="checkout__main">
        <SfSteps
          :active="currentStep"
          :steps="steps.map(step => step.name)"
          @change="changeStep"
        >
          <SfStep v-for="step in steps" :key="step.key" :name="step.name">
            <component :is="step.component" :is-active="true" />
          </SfStep>
        </SfSteps>
      </div>
      <div class="checkout__aside desktop-only">
        <transition name="fade">
          <OOrderSummary v-if="currentStep <= 2" class="checkout__aside-order" />
          <OOrderReview v-else class="checkout__aside-order" />
        </transition>
      </div>
    </div>
    <OOrderConfirmation v-if="isThankYouPage" />
  </div>
</template>
<script>
import Checkout from '@vue-storefront/core/pages/Checkout';
import { SfSteps } from '@storefront-ui/vue';
import OPayment from 'theme/components/organisms/o-payment';
import OShipping from 'theme/components/organisms/o-shipping';
import OConfirmOrder from 'theme/components/organisms/o-confirm-order';
import OOrderReview from 'theme/components/organisms/o-order-review';
import OOrderSummary from 'theme/components/organisms/o-order-summary';
import OOrderConfirmation from 'theme/components/organisms/o-order-confirmation';
import OPersonalDetails from 'theme/components/organisms/o-personal-details';

export default {
  name: 'Checkout',
  components: {
    SfSteps,
    OPayment,
    OShipping,
    OOrderReview,
    OOrderSummary,
    OConfirmOrder,
    OPersonalDetails,
    OOrderConfirmation
  },
  mixins: [Checkout],
  data () {
    return {
      steps: [
        {
          key: 'personalDetails',
          name: this.$t('Details'),
          component: OPersonalDetails
        },
        {
          key: 'shipping',
          name: this.$t('Shipping'),
          component: OShipping
        },
        {
          key: 'payment',
          name: this.$t('Payment'),
          component: OPayment
        },
        {
          key: 'orderReview',
          name: this.$t('Review'),
          component: OConfirmOrder
        }
      ]
    };
  },
  computed: {
    currentStep () {
      return this.steps.findIndex(step => this.activeSection[step.key]);
    }
  },
  methods: {
    changeStep (nextStep) {
      if (nextStep < this.currentStep) {
        this.$bus.$emit('checkout-before-edit', this.steps[nextStep].key);
      }
    },
    showNotification ({ type, message }) {
      this.$store.dispatch('notification/spawnNotification', {
        type,
        message,
        action1: { label: this.$t('OK') }
      });
    },
    notifyEmptyCart () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'Shopping cart is empty. Please add some products before entering Checkout'
        )
      });
    },
    notifyOutStock (p) {
      this.showNotification({
        type: 'danger',
        message: p.name + this.$t(' is out of stock!')
      });
    },
    notifyNotAvailable () {
      this.showNotification({
        type: 'danger',
        message: this.$t('Some of the ordered products are not available!')
      });
    },
    notifyStockCheck () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'Stock check in progress, please wait while available stock quantities are checked'
        )
      });
    },
    notifyNoConnection () {
      this.showNotification({
        type: 'warning',
        message: this.$t(
          'There is no Internet connection. You can still place your order. We will notify you if any of ordered products is not available because we cannot check it right now.'
        )
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#checkout {
  box-sizing: border-box;
  @include for-desktop {
    padding: 0 var(--spacer-sm);
    max-width: 1272px;
    margin: 0 auto;
  }
}
.checkout {
  --steps-content-padding: 0 var(--spacer-sm);
  @include for-desktop {
    --steps-content-padding: 0;
    display: flex;
  }
  &__main {
    @include for-desktop {
      flex: 1;
      padding: var(--spacer-xl) 0 0 0;
    }
  }
  &__aside {
    @include for-desktop {
      flex: 0 0 26.8125rem;
      margin: 0 0 0 var(--spacer-xl);
    }
    &-order {
      box-sizing: border-box;
      width: 100%;
      box-shadow: 0px 4px 11px rgba(var(--c-dark-base), 0.1);
      background: var(--c-light);
      padding: var(--spacer-xl) calc(var(--spacer-lg) * 2);
    }
  }
}
</style>
