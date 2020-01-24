<template>
  <div class="o-payment">
    <SfHeading
      :title="`${isVirtualCart ? 2 : 3}. ${$t('Payment')}`"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <div v-if="!isVirtualCart" class="form__element form__group">
        <SfCheckbox
          v-model="sendToShippingAddress"
          class="form__checkbox"
          name="sendToShippingAddress"
          :label="$t('Copy address data from shipping')"
        />
      </div>
      <div v-if="hasBillingData()" class="form__element form__group">
        <SfCheckbox
          v-model="sendToBillingAddress"
          class="form__checkbox"
          name="sendToBillingAddress"
          :label="$t('Use my billing data')"
        />
      </div>
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
          class="form__element form__radio payment-method"
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
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators';
import { Payment } from '@vue-storefront/core/modules/checkout/components/Payment';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfSelect,
  SfHeading,
  SfCheckbox
} from '@storefront-ui/vue';
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
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
@mixin for-mobile {
  @media screen and (max-width: $desktop-min) {
    @content;
  }
}
.title {
  margin-bottom: $spacer-extra-big;
}
.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
  }
  &__element {
    margin-bottom: $spacer-extra-big;
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding-left: $spacer-extra-big;
        }
      }
    }
  }
  &__action {
    @include for-desktop {
      flex: 0 0 100%;
      display: flex;
    }
  }
  &__action-button {
    flex: 1;
    &--secondary {
      margin: $spacer-big 0;
      @include for-desktop {
        order: -1;
        margin: 0;
        text-align: left;
      }
    }
  }
  &__select {
    ::v-deep .sf-select__selected {
      padding: 5px 0;
    }
  }
  &__radio {
    white-space: nowrap;
    margin-bottom: 0;
    &-group {
      flex: 0 0 100%;
      margin: 0 0 $spacer-extra-big 0;
    }
  }
}
.payment-image {
  display: flex;
  align-items: center;
  height: 2.125rem;
  width: auto;
  ::v-deep > * {
    width: auto;
    max-width: unset;
  }
}
.payment-methods {
  @include for-desktop {
    display: flex;
    padding: $spacer-big 0;
    border-top: 1px solid $c-light;
    border-bottom: 1px solid $c-light;
  }
}
.payment-method {
  border-top: 1px solid $c-light;
  @include for-mobile {
    background-color: transparent;
  }
  @include for-desktop {
    border: 0;
    border-radius: 4px;
  }
  &:last-child {
    border-bottom: 1px solid $c-light;
    @include for-desktop {
      border-bottom: 0;
    }
  }
  ::v-deep {
    .sf-radio {
      &__container {
        align-items: center;
      }
      &__content {
        margin: 0 0 0 $spacer;
      }
    }
  }
}
</style>
