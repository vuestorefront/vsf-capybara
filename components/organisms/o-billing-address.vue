<template>
  <div class="o-billing-address">
    <SfHeading
      :title="`${$t('Billing address')}`"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form" :disabled="isAddressFormDisabled">
      <SfCheckbox
        v-if="!isVirtualCart"
        v-model="sendToShippingAddress"
        class="form__element form__checkbox -always-enabled"
        name="sendToShippingAddress"
        :label="$t('Copy address data from shipping')"
        :disabled="isFormFieldsDisabled"
      />
      <SfCheckbox
        v-if="hasBillingData()"
        v-model="sendToBillingAddress"
        class="form__element form__checkbox"
        name="sendToBillingAddress"
        :label="$t('Use my billing data')"
        :disabled="isFormFieldsDisabled"
      />
      <SfInput
        v-model.trim="payment.firstName"
        class="form__element form__element--half"
        name="first-name"
        :label="$t('First name')"
        :required="true"
        :disabled="isFormFieldsDisabled"
        :valid="!$v.payment.firstName.$error"
        :error-message="
          !$v.payment.firstName.required
            ? $t('Field is required')
            : $t('Name must have at least 2 letters.')
        "
        @blur="$v.payment.firstName.$touch()"
      />
      <SfInput
        v-model.trim="payment.lastName"
        class="form__element form__element--half form__element--half-even"
        name="last-name"
        :label="$t('Last name')"
        :required="true"
        :disabled="isFormFieldsDisabled"
        :valid="!$v.payment.lastName.$error"
        :error-message="$t('Field is required')"
        @blur="$v.payment.lastName.$touch()"
      />
      <SfInput
        v-model.trim="payment.streetAddress"
        class="form__element"
        name="street-address"
        :label="$t('Address')"
        :required="true"
        :disabled="isFormFieldsDisabled"
        :valid="!$v.payment.streetAddress.$error"
        :error-message="$t('Field is required')"
        @blur="$v.payment.streetAddress.$touch()"
      />
      <SfInput
        v-model.trim="payment.city"
        class="form__element form__element--half"
        name="city"
        :label="$t('City')"
        :required="true"
        :disabled="isFormFieldsDisabled"
        :valid="!$v.payment.city.$error"
        :error-message="$t('Field is required')"
        @blur="$v.payment.city.$touch()"
      />
      <SfInput
        v-if="!isSelectedCountryHasStates"
        v-model.trim="payment.state"
        class="form__element form__element--half form__element--half-even"
        name="state"
        :label="$t('State / Province')"
        :disabled="isFormFieldsDisabled"
      />
      <MMultiselect
        v-if="isSelectedCountryHasStates && canShowStateSelector"
        v-model.trim="payment.state"
        class="
          form__element
          form__element--half
          form__element--half-even
          form__select
        "
        name="state"
        :label="$t('State / Province')"
        :required="true"
        id-field="code"
        label-field="name"
        :options="getStatesForSelectedCountry"
        :valid="!$v.payment.state.$error"
        :error-message="$t('Field is required')"
        :disabled="isFormFieldsDisabled"
      />
      <SfInput
        v-model.trim="payment.zipCode"
        class="form__element form__element--half"
        name="zipCode"
        :label="$t('Zip-code')"
        :required="true"
        :disabled="isFormFieldsDisabled"
        :valid="!$v.payment.zipCode.$error"
        :error-message="
          !$v.payment.zipCode.required
            ? $t('Field is required')
            : $t('Name must have at least 3 letters.')
        "
        @blur="$v.payment.zipCode.$touch()"
      />
      <MMultiselect
        v-model="payment.country"
        class="
          form__element
          form__element--half
          form__element--half-even
          form__select
        "
        name="countries"
        :label="$t('Country')"
        :required="true"
        id-field="code"
        label-field="name"
        :options="countries"
        :valid="!$v.payment.country.$error"
        :error-message="$t('Field is required')"
        :disabled="isFormFieldsDisabled"
        @change="changeCountry"
      />
      <SfInput
        v-model.trim="payment.phoneNumber"
        :required="isPhoneNumberRequired"
        :valid="!$v.payment.phoneNumber.$error"
        :error-message="$t('Field is required')"
        class="form__element"
        name="phone"
        :label="$t('Phone number')"
        :disabled="isFormFieldsDisabled"
        @blur="$v.payment.phoneNumber.$touch()"
      />
    </div>
    <div class="form">
      <div class="form__action">
        <SfButton
          class="sf-button--full-width form__action-button"
          @click="onGoReviewButtonClicked"
        >
          {{ $t('Go review the order') }}
        </SfButton>
        <SfButton
          class="
            sf-button--full-width sf-button--text
            form__action-button form__action-button--secondary
          "
          @click="$bus.$emit('checkout-before-edit', isVirtualCart ? 'personalDetails' :'shipping')"
        >
          {{ isVirtualCart ? $t('Edit contact') : $t('Edit shipping') }}
        </SfButton>
      </div>
    </div>
    <!-- This dummy container below is needed because src\modules\payment-cash-on-delivery\index.ts
         tries to inject here a component with payment description -->
    <div v-show="false" id="checkout-order-review-additional-container" />
  </div>
</template>
<script>
import { required, requiredIf, minLength } from 'vuelidate/lib/validators';
import { mapGetters } from 'vuex';
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators';
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment';
import {
  SfInput,
  SfButton,
  SfHeading,
  SfCheckbox
} from '@storefront-ui/vue';
import { createSmoothscroll } from 'theme/helpers';
import MMultiselect from 'theme/components/molecules/m-multiselect';

import {
  KEY as AMAZON_PAY_MODULE_KEY,
  METHOD_CODE as AMAZON_PAY_PAYMENT_METHOD_CODE
} from 'src/modules/vsf-amazon-pay/index';

const States = require('@vue-storefront/i18n/resource/states.json');

const addressKeys = ['firstName', 'lastName', 'phoneNumber', 'country', 'city', 'state', 'streetAddress', 'zipCode'];

export default {
  name: 'OBillingAddress',
  components: {
    SfInput,
    SfButton,
    SfHeading,
    SfCheckbox,
    MMultiselect
  },
  mixins: [Payment],
  validations () {
    const rules = {
      firstName: {
        required,
        minLength: minLength(2),
        unicodeAlpha
      },
      lastName: {
        required,
        unicodeAlpha
      },
      country: {
        required
      },
      state: {
        required: requiredIf(function () {
          return this.isSelectedCountryHasStates;
        })
      },
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      zipCode: {
        required,
        minLength: minLength(3),
        unicodeAlphaNum
      },
      city: {
        required,
        unicodeAlpha
      },
      paymentMethod: {
        required
      },
      phoneNumber: {
        required: requiredIf(function () { return this.isPhoneNumberRequired })
      }
    };

    const rulesForInvoice = {
      company: {
        required,
        unicodeAlphaNum
      },
      taxId: {
        required,
        minLength: minLength(3)
      }
    };

    return this.generateInvoice
      ? {
        payment: {
          ...rules,
          ...rulesForInvoice
        }
      }
      : {
        payment: {
          ...rules
        }
      };
  },
  data: () => {
    return {
      states: States,
      fCanShowStateSelector: false
    };
  },
  computed: {
    ...mapGetters({
      isVirtualCart: 'cart/isVirtualCart'
    }),
    isPhoneNumberRequired () {
      return this.payment.country && this.payment.country !== 'US';
    },
    isAddressFormDisabled () {
      return this.sendToShippingAddress || this.sendToBillingAddress;
    },
    isSelectedCountryHasStates () {
      if (!this.payment.country || !this.states) {
        return false;
      }

      return this.states.hasOwnProperty(this.payment.country);
    },
    getStatesForSelectedCountry () {
      if (!this.isSelectedCountryHasStates) {
        return [];
      }

      return this.states[this.payment.country];
    },
    canShowStateSelector () {
      return this.fCanShowStateSelector;
    },
    getPaymentCountry () {
      return this.payment.country;
    },
    cartItems () {
      return this.$store.getters['cart/getCartItems'];
    },
    isFormFieldsDisabled () {
      let paymentDetails = this.$store.getters['checkout/getPaymentDetails'];

      if (paymentDetails.paymentMethod !== AMAZON_PAY_PAYMENT_METHOD_CODE) {
        return false;
      }

      let amazonOrderState = this.$store.state[AMAZON_PAY_MODULE_KEY].orderState;

      if (!amazonOrderState) {
        return false;
      }

      if (paymentDetails.firstName !== '' &&
        paymentDetails.lastName !== '' &&
        paymentDetails.streetAddress !== '' &&
        paymentDetails.city !== '' &&
        paymentDetails.zipCode !== '' &&
        paymentDetails.country !== '') {
        return true;
      }

      return false;
    },
    isShippingAndBillingAddressesEquals () {
      const paymentDetails = this.$store.getters['checkout/getPaymentDetails'];
      const shippingDetails = this.$store.getters['checkout/getShippingDetails'];

      return addressKeys.every(
        (key) => paymentDetails[key] === shippingDetails[key]
      );
    },
    isBillingAddressEmpty () {
      const paymentDetails = this.$store.getters['checkout/getPaymentDetails'];
      return addressKeys.every((key) => !paymentDetails[key] || key === 'country');
    }
  },
  created () {
    if (this.isShippingAndBillingAddressesEquals || this.isBillingAddressEmpty) {
      this.sendToShippingAddress = true;
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.fCanShowStateSelector = true;
    })
    createSmoothscroll(
      document.documentElement.scrollTop || document.body.scrollTop,
      0
    );
  },
  methods: {
    async changeCountry () {
      await this.$nextTick();
      this.validateCountryRelatedFields();

      await Promise.all([
        this.$store.dispatch('checkout/updatePaymentDetails', { country: this.payment.country }),
        this.$store.dispatch('cart/syncPaymentMethods', { forceServerSync: true })
      ]);
    },
    onGoReviewButtonClicked () {
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      this.sendDataToCheckout();
      this.$store.dispatch('cart/syncPaymentMethods', { forceServerSync: true });
    },
    validateCountryRelatedFields () {
      this.$v.payment.state.$touch();
      this.$v.payment.phoneNumber.$touch();
    }
  },
  watch: {
    getPaymentCountry (after, before) {
      this.fCanShowStateSelector = false;

      if (after && before) {
        this.payment.state = '';
      }

      if (after && before !== after) {
        this.changeCountry();
      }

      this.$nextTick(() => {
        this.fCanShowStateSelector = true;
      });
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.title {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-padding: var(--spacer-xl) 0 var(--spacer-base) 0;
  }
}

.gift-card-payment {
  width: 100%;
}

.form {
  &__checkbox {
    --checkbox-label-color: var(--c-dark-variant);
    margin: 0 0 var(--spacer-sm) 0;
  }
  &__group {
    display: flex;
    align-items: center;
  }
  &__action {
    margin: var(--spacer-base) 0;
    &-button {
      &:first-child {
        --button-height: 4.0625rem;
      }
      &--secondary {
        margin: var(--spacer-base) 0;
      }
    }
  }

  &[disabled] {
    .form__element {
      &:not(.-always-enabled) {
        pointer-events: none;
        opacity: 0.75;
      }
    }
  }

  &__element {
      margin: 0 0 var(--spacer-sm) 0;
  }

  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-right: var(--spacer-2xl);

    &__element {
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-xl);
        }
      }
    }
    &__action {
      flex: 0 0 100%;
      display: flex;
    }
  }
}
</style>
