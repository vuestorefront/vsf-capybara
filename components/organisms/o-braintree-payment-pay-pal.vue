<template>
  <div class="checkout-paypal">
    <slot name="title" />
  </div>
</template>

<script lang="ts">
import braintree, { PayPalCheckout } from 'braintree-web';
import { PayPalCheckoutTokenizationOptions } from 'braintree-web/modules/paypal-checkout';

import PaymentMethod from 'src/modules/payment-braintree/mixins/PaymentMethod';
import { SET_PAYMENT_DATA } from 'src/modules/payment-braintree/store/mutation-types';

enum FlowType {
  Vault = 'vault',
  Checkout = 'checkout'
}

enum Intent {
  Authorize = 'authorize',
  Order = 'order',
  Capture = 'capture'
}

export default PaymentMethod.extend({
  name: 'OBraintreePaymentPayPal',
  props: {
    paypalButtonContainerId: {
      type: String,
      required: true
    }
  },
  async created (): Promise<void> {
    try {
      const paypalCheckoutInstance = await braintree.paypalCheckout.create({
        client: this.braintreeClient
      });

      await paypalCheckoutInstance.loadPayPalSDK({
        currency: this.currency,
        intent: 'capture'
      });

      await this.onPayPalSdkLoaded(paypalCheckoutInstance);
    } catch (error) {
      this.$emit('error', error);
    }
  },
  methods: {
    async onPayPalSdkLoaded (paypalCheckoutInstance: PayPalCheckout): Promise<void> {
      const paypal = (this.window as any).paypal;
      if (!paypal) {
        return;
      }

      const buttons = await paypal.Buttons({
        fundingSource: paypal.FUNDING.PAYPAL,
        style: {
          label: 'pay',
          color: 'blue'
        },
        createOrder: () => {
          return paypalCheckoutInstance.createPayment({
            flow: FlowType.Checkout,
            amount: this.total,
            currency: this.currency,
            intent: Intent.Capture
          });
        },
        onApprove: (data: PayPalCheckoutTokenizationOptions) => {
          return paypalCheckoutInstance.tokenizePayment(data, (error, payload) => {
            if (error) {
              this.$emit('error', error);
              return;
            }

            this.$store.commit(`braintree/${SET_PAYMENT_DATA}`, {
              payment_method_nonce: payload.nonce,
              budsies_payment_method_code: this.getPaymentMethodCode(payload.type)
            });

            this.$emit('success', payload);
          })
        },
        onError: (error: string) => {
          this.$emit('error', error)
        }
      });

      buttons.render(`#${this.paypalButtonContainerId}`);
    }
  }
})
</script>

<style lang="scss" scoped>
.checkout-paypal {
  ._button {
    margin: var(--spacer-sm) var(--spacer-sm) 0;
  }
}
</style>
