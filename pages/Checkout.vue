<template>
  <div id="checkout">
    <div v-if="!showThankYouPage" class="checkout">
      <div class="checkout__main">
        <SfSteps
          :active="currentStep"
          :steps="availableSteps.map(step => step.name)"
          @change="changeStep"
        >
          <template>
            <ProductionSpotCountdown
              :can-show="canShowProductionSpotCountdown"
              class="_production-spot-countdown"
            />

            <SfStep v-for="step in availableSteps" :key="step.key" :name="step.name">
              <component :is="step.component" :is-active="true" />
            </SfStep>
          </template>
        </SfSteps>
      </div>
      <div class="checkout__aside desktop-only">
        <transition name="fade">
          <div v-if="!isReviewStep">
            <OCartItemsTable :cart-items="productsInCart" :should-show-header="false" />
            <OOrderSummary class="checkout__aside-order" />
          </div>
          <OOrderReview v-else class="checkout__aside-order" />
        </transition>
      </div>
    </div>
    <OOrderSuccess v-else class="_order-success" />
  </div>
</template>
<script>
import Checkout from '@vue-storefront/core/pages/Checkout';
import { SfSteps } from '@storefront-ui/vue';
import { mapGetters } from 'vuex';
import isCustomProduct from 'src/modules/shared/helpers/is-custom-product.function';

import OBillingAddress from 'theme/components/organisms/o-billing-address';
import OShipping from 'theme/components/organisms/o-shipping';
import OConfirmOrder from 'theme/components/organisms/o-confirm-order';
import OOrderReview from 'theme/components/organisms/o-order-review';
import OOrderSummary from 'theme/components/organisms/o-order-summary';
import OOrderSuccess from 'theme/components/organisms/o-order-success';
import OPersonalDetails from 'theme/components/organisms/o-personal-details';
import OCartItemsTable from 'theme/components/organisms/o-cart-items-table';
import ProductionSpotCountdown from 'src/modules/promotion-platform/components/ProductionSpotCountdown.vue';

const successParamValue = 'success';
const orderReviewStepKey = 'orderReview';

export default {
  name: 'Checkout',
  props: {
    success: {
      type: String,
      default: undefined
    }
  },
  components: {
    SfSteps,
    OBillingAddress,
    OShipping,
    OOrderReview,
    OOrderSummary,
    OConfirmOrder,
    OPersonalDetails,
    OCartItemsTable,
    OOrderSuccess,
    ProductionSpotCountdown
  },
  mixins: [Checkout],
  data () {
    return {
      steps: [
        {
          key: 'personalDetails',
          name: this.$t('Contact'),
          component: OPersonalDetails
        },
        {
          key: 'shipping',
          name: this.$t('Shipping'),
          component: OShipping
        },
        {
          key: 'payment',
          name: this.$t('Billing address'),
          component: OBillingAddress
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
    ...mapGetters({
      productsInCart: 'cart/getCartItems',
      isVirtualCart: 'cart/isVirtualCart'
    }),
    currentStep () {
      return this.availableSteps.findIndex(step => this.activeSection[step.key]);
    },
    isSuccess () {
      return this.success === successParamValue;
    },
    showThankYouPage () {
      return this.isThankYouPage && this.isSuccess;
    },
    availableSteps () {
      if (this.isVirtualCart) {
        return this.steps.filter(step => step.key !== 'shipping');
      }

      return this.steps;
    },
    isReviewStep () {
      return this.availableSteps[this.currentStep].key === orderReviewStepKey;
    },
    canShowProductionSpotCountdown () {
      return this.productsInCart.some((product) => isCustomProduct(product.id));
    }
  },
  beforeMount () {
    this.$bus.$on('order-after-placed', this.onOrderAfterPlacedHandler);
  },
  beforeDestroy () {
    this.$bus.$off('order-after-placed', this.onOrderAfterPlacedHandler)
  },
  methods: {
    activateHashSection () {
      if (!this.showThankYouPage) {
        Checkout.methods.activateHashSection.bind(this)();
      }
    },
    changeStep (newStepIndex) {
      if (newStepIndex < this.currentStep) {
        this.$bus.$emit('checkout-before-edit', this.availableSteps[newStepIndex].key);
      }
    },
    async onOrderAfterPlacedHandler () {
      if (!this.isSuccess) {
        await this.$router.push({
          name: 'checkout',
          params: {
            success: successParamValue
          }
        });
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
    width: 100%;
}

._order-success {
  flex: 1;
  padding: var(--spacer-xl) 0 0 0;
}

}
.checkout {
  --steps-content-padding: 0 var(--spacer-sm);

  ._production-spot-countdown {
    margin-top: var(--spacer-sm);
  }

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
