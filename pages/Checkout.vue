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
          <OOrderSummary v-if="currentStep <= 2" />
          <OOrderReview v-else />
        </transition>
      </div>
    </div>
    <thank-you-page v-if="isThankYouPage" />
  </div>
</template>
<script>
import i18n from '@vue-storefront/i18n';
import Checkout from '@vue-storefront/core/pages/Checkout';
import { SfSteps } from '@storefront-ui/vue';
import OPayment from 'theme/components/organisms/o-payment';
import OShipping from 'theme/components/organisms/o-shipping';
import OConfirmOrder from 'theme/components/organisms/o-confirm-order';
import OOrderReview from 'theme/components/organisms/o-order-review';
import OOrderSummary from 'theme/components/organisms/o-order-summary';
import OPersonalDetails from 'theme/components/organisms/o-personal-details';
import ThankYouPage from 'theme/components/core/blocks/Checkout/ThankYouPage';

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
    ThankYouPage
  },
  mixins: [Checkout],
  data () {
    return {
      steps: [
        {
          key: 'personalDetails',
          name: i18n.t('Personal Details'),
          component: OPersonalDetails
        },
        {
          key: 'shipping',
          name: i18n.t('Shipping'),
          component: OShipping
        },
        {
          key: 'payment',
          name: i18n.t('Payment'),
          component: OPayment
        },
        {
          key: 'orderReview',
          name: i18n.t('Review order'),
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
        type: 'error',
        message: p.name + this.$t(' is out of stock!')
      });
    },
    notifyNotAvailable () {
      this.showNotification({
        type: 'error',
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
@import "~@storefront-ui/shared/styles/_variables.scss";
@import "~@storefront-ui/shared/styles/helpers/visibility";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
#checkout {
  box-sizing: border-box;
  padding: 0 $spacer-big;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
    padding: 0;
  }
  ::v-deep {
    .sf-steps__header {
      &-step {
        cursor: initial;
      }
      &-step-done {
        cursor: pointer;
      }
    }
  }
}
.checkout {
  @include for-desktop {
    display: flex;
  }
  &__main {
    @include for-desktop {
      flex: 1;
    }
  }
  &__aside {
    @include for-desktop {
      flex: 0 0 25.5rem;
      margin-left: 6.25rem;
    }
  }
}
</style>
