<template>
  <div class="o-payment">
    <SfHeading
      :title="`${isVirtualCart ? 2 : 3}. ${$t('Payment')}`"
      :level="2"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <SfCheckbox
        v-if="!isVirtualCart"
        v-model="sendToShippingAddress"
        class="form__element form__checkbox"
        name="sendToShippingAddress"
        :label="$t('Copy address data from shipping')"
      />
      <SfCheckbox
        v-model="sendToBillingAddress"
        class="form__element form__checkbox"
        name="sendToBillingAddress"
        :label="$t('Use my billing data')"
      />
      <SfInput
        v-model.trim="payment.firstName"
        class="form__element form__element--half"
        name="first-name"
        :label="$t('First name')"
        :required="true"
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
        :valid="!$v.payment.lastName.$error"
        :error-message="$t('Field is required')"
        @blur="$v.payment.lastName.$touch()"
      />
      <SfInput
        v-model.trim="payment.streetAddress"
        class="form__element"
        name="street-address"
        :label="$t('Street name')"
        :required="true"
        :valid="!$v.payment.streetAddress.$error"
        :error-message="$t('Field is required')"
        @blur="$v.payment.streetAddress.$touch()"
      />
      <SfInput
        v-model.trim="payment.apartmentNumber"
        class="form__element"
        name="apartment-number"
        :label="$t('House/Apartment number')"
        :required="true"
        :valid="!$v.payment.apartmentNumber.$error"
        :error-message="$t('Field is required')"
        @blur="$v.payment.apartmentNumber.$touch()"
      />
      <SfInput
        v-model.trim="payment.city"
        class="form__element form__element--half"
        name="city"
        :label="$t('City')"
        :required="true"
        :valid="!$v.payment.city.$error"
        :error-message="$t('Field is required')"
        @blur="$v.payment.city.$touch()"
      />
      <SfInput
        v-model.trim="payment.state"
        class="form__element form__element--half form__element--half-even"
        name="state"
        :label="$t('State / Province')"
      />
      <SfInput
        v-model.trim="payment.zipCode"
        class="form__element form__element--half"
        name="zipCode"
        :label="$t('Zip-code')"
        :required="true"
        :valid="!$v.payment.zipCode.$error"
        :error-message="
          !$v.payment.zipCode.required
            ? $t('Field is required')
            : $t('Name must have at least 3 letters.')
        "
        @blur="$v.payment.zipCode.$touch()"
      />
      <SfSelect
        v-model="payment.country"
        class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
        name="countries"
        :label="$t('Country')"
        :required="true"
        :valid="!$v.payment.country.$error"
        :error-message="$t('Field is required')"
        @change="changeCountry"
      >
        <SfSelectOption
          v-for="country in countries"
          :key="country.code"
          :value="country.code"
        >
          {{ country.name }}
        </SfSelectOption>
      </SfSelect>
      <SfInput
        v-model.trim="payment.phoneNumber"
        class="form__element"
        name="phone"
        :label="$t('Phone Number')"
      />
      <SfCheckbox
        v-model="generateInvoice"
        class="form__element form__checkbox"
        name="generateInvoice"
        :label="$t('I want to generate an invoice for the company')"
      />
      <template v-if="generateInvoice">
        <SfInput
          v-model.trim="payment.company"
          class="form__element form__element--half"
          name="company-name"
          :label="$t('Company name')"
          :required="true"
          :valid="!$v.payment.company.$error"
          :error-message="$t('Field is required')"
          @blur="$v.payment.company.$touch()"
        />
        <SfInput
          v-model.trim="payment.taxId"
          class="form__element form__element--half form__element--half-even"
          name="tax-id"
          :label="$t('Tax identification number')"
          :required="true"
          :valid="!$v.payment.taxId.$error"
          :error-message="
            !$v.payment.taxId.required
              ? $t('Field is required')
              : $t('Tax identification number must have at least 3 letters.')
          "
          @blur="$v.payment.taxId.$touch()"
        />
        <p class="mb40 mt0">
          {{ $t("We will send you the invoice to given e-mail address") }}
        </p>
      </template>
    </div>
    <SfHeading
      :title="$t('Payment method')"
      :level="3"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <div class="form__radio-group">
        <SfRadio
          v-for="method in paymentMethods"
          :key="method.code"
          v-model="payment.paymentMethod"
          :label="method.title ? method.title : method.name"
          :value="method.code"
          name="payment-method"
          class="form__radio payment-method"
          @input="changePaymentMethod"
        />
      </div>
      <div class="form__action">
        <SfButton
          class="sf-button--full-width form__action-button"
          :disabled="$v.payment.$invalid"
          @click="sendDataToCheckout"
        >
          {{ $t("Go review the order") }}
        </SfButton>
        <SfButton
          class="sf-button--full-width sf-button--text form__action-button form__action-button--secondary"
          @click="$bus.$emit('checkout-before-edit', 'shipping')"
        >
          {{ $t("Edit shipping") }}
        </SfButton>
      </div>
    </div>
    <!-- This dummy container below is needed because src\modules\payment-cash-on-delivery\index.ts
         tries to inject here a component with payment description -->
    <div v-show="false" id="checkout-order-review-additional-container" />
  </div>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators';
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators';
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfSelect,
  SfHeading,
  SfCheckbox
} from '@storefront-ui/vue';
import { createSmoothscroll } from 'theme/helpers';

export default {
  name: 'OPayment',
  components: {
    SfInput,
    SfRadio,
    SfButton,
    SfSelect,
    SfHeading,
    SfCheckbox
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
      streetAddress: {
        required,
        unicodeAlphaNum
      },
      apartmentNumber: {
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
  mounted () {
    createSmoothscroll(document.documentElement.scrollTop || document.body.scrollTop, 0);
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.title {
  --heading-padding: var(--spacer-base) 0;
  @include for-desktop {
    --heading-title-font-size: var(--h3-font-size);
    --heading-padding: var(--spacer-2xl) 0 var(--spacer-base) 0;
    &:last-of-type {
      --heading-padding: var(--spacer-xs) 0 var(--spacer-base) var(--spacer-xs);
    }
  }
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
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 var(--spacer-2xl) 0 var(--spacer-xs);
    &__element {
      padding: 0 0 var(--spacer-xs) 0;
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
.payment-method {
  --radio-container-align-items: center;
  --radio-container-padding: var(--spacer-sm) 0;
  --ratio-content-margin: 0 0 0 var(--spacer-lg);
  --radio-background: transparent;
  white-space: nowrap;
  @include for-desktop {
    --radio-container-padding: var(--spacer-sm);
  }
}
</style>
