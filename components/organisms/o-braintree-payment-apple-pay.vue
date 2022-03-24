<template>
  <div class="checkout-apple-pay" v-if="!!applePayCheckoutInstance">
    <slot name="title" />
  </div>
</template>

<script lang="ts">
import config from 'config'
import braintree, { ApplePay } from 'braintree-web';

import PaymentMethod from 'src/modules/payment-braintree/mixins/PaymentMethod';
import { SET_PAYMENT_DATA } from 'src/modules/payment-braintree/store/mutation-types';
import { InjectType } from 'src/modules/shared';

interface InjectedServices {
  window: Window
}

export default PaymentMethod.extend({
  name: 'OBraintreePaymentApplePay',
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  data () {
    return {
      applePayCheckoutInstance: undefined as undefined | ApplePay
    }
  },
  async created (): Promise<void> {
    if (!(this.window as any).ApplePaySession ||
     !(this.window as any).ApplePaySession.canMakePayments()
    ) {
      return;
    }

    try {
      this.applePayCheckoutInstance = await braintree.applePay.create({ client: this.braintreeClient });
    } catch (error) {
      this.$emit('error', error);
    }
  },
  methods: {
    doPayment () {
      if (!this.applePayCheckoutInstance) {
        throw new Error('ApplePay instance is undefined');
      }

      const paymentRequest = this.applePayCheckoutInstance.createPaymentRequest({
        total: {
          label: config.braintree.applePay.label,
          amount: this.total.toString(10)
        },

        requiredBillingContactFields: ['postalAddress']
      });

      const session = new (this.window as any).ApplePaySession(3, paymentRequest);

      session.onvalidatemerchant = (event: any) => this.onValidateMerchant(event, session);
      session.onpaymentauthorized = (event: any) => this.onPaymentAuthorized(event, session);
      session.begin();
    },
    async onValidateMerchant (event: any, session: any): Promise<void> {
      if (!this.applePayCheckoutInstance) {
        throw new Error('ApplePay instance is undefined');
      }

      try {
        const merchantSession = await this.applePayCheckoutInstance.performValidation({
          validationURL: event.validationURL,
          displayName: config.braintree.applePay.displayName
        });

        session.completeMerchantValidation(merchantSession);
      } catch (error) {
        this.$emit('error', error)
      }
    },
    async onPaymentAuthorized (event: any, session: any): Promise<void> {
      if (!this.applePayCheckoutInstance) {
        return;
      }

      try {
        const payload = await this.applePayCheckoutInstance.tokenize({
          token: event.payment.token
        });

        this.$store.commit(`braintree/${SET_PAYMENT_DATA}`, {
          payment_method_nonce: payload.nonce,
          budsies_payment_method_code: this.getPaymentMethodCode(payload.type)
        });

        this.$emit('success', payload);
        session.completePayment((this.window as any).ApplePaySession.STATUS_SUCCESS);
      } catch (error) {
        session.completePayment((this.window as any).ApplePaySession.STATUS_FAILURE);
      }
    }
  }
})
</script>

<style lang="scss" scoped>
.checkout-apple-pay {
  ._apple-pay {
    margin: var(--spacer-sm) var(--spacer-sm) 0;
  }

  @supports not (-webkit-appearance: -apple-pay-button) {
    ._apple-pay {
      display: inline-block;
      background-size: 100% 60%;
      background-repeat: no-repeat;
      background-position: 50% 50%;
      border-radius: 5px;
      padding: 0px;
      box-sizing: border-box;
      min-width: 200px;
      min-height: 32px;
      max-height: 64px;
      background-image: -webkit-named-image(apple-pay-logo-white);
      background-color: black;
    }
  }

  @supports (-webkit-appearance: -apple-pay-button) {
    ._apple-pay {
      display: inline-block;
      -webkit-appearance: -apple-pay-button;
      -apple-pay-button-type: plain;
    }
  }
}
</style>
