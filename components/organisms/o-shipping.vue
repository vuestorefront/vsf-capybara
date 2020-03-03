<template>
  <div class="o-shipping">
    <SfHeading
      :title="`2. ${$t('Shipping')}`"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <div
        v-if="currentUser && hasShippingDetails()"
        class="form__element form__group"
      >
        <SfCheckbox
          v-model="shipToMyAddress"
          class="form__checkbox"
          name="shipToMyAddress"
          :label="$t('Ship to my default address')"
        />
      </div>
      <SfInput
        v-model.trim="shipping.firstName"
        class="form__element form__element--half"
        name="first-name"
        :label="$t('First name')"
        :required="true"
        :valid="!$v.shipping.firstName.$error"
        :error-message="
          !$v.shipping.firstName.required
            ? $t('Field is required')
            : $t('Name must have at least 2 letters.')
        "
        @blur="$v.shipping.firstName.$touch()"
      />
      <SfInput
        v-model.trim="shipping.lastName"
        class="form__element form__element--half form__element--half-even"
        name="last-name"
        :label="$t('Last name')"
        :required="true"
        :valid="!$v.shipping.lastName.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.lastName.$touch()"
      />
      <SfInput
        v-model.trim="shipping.streetAddress"
        class="form__element"
        name="street-address"
        :label="$t('Street name')"
        :required="true"
        :valid="!$v.shipping.streetAddress.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.streetAddress.$touch()"
      />
      <SfInput
        v-model.trim="shipping.apartmentNumber"
        class="form__element"
        name="apartment-number"
        :label="$t('House/Apartment number')"
        :required="true"
        :valid="!$v.shipping.apartmentNumber.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.apartmentNumber.$touch()"
      />
      <SfInput
        v-model.trim="shipping.city"
        class="form__element form__element--half"
        name="city"
        :label="$t('City')"
        :required="true"
        :valid="!$v.shipping.city.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.city.$touch()"
      />
      <SfInput
        v-model.trim="shipping.state"
        class="form__element form__element--half form__element--half-even"
        name="state"
        :label="$t('State / Province')"
      />
      <SfInput
        v-model.trim="shipping.zipCode"
        class="form__element form__element--half"
        name="zipCode"
        :label="$t('Zip-code')"
        :required="true"
        :valid="!$v.shipping.zipCode.$error"
        :error-message="
          !$v.shipping.zipCode.required
            ? $t('Field is required')
            : $t('Name must have at least 3 letters.')
        "
        @blur="$v.shipping.zipCode.$touch()"
      />
      <SfSelect
        v-model="shipping.country"
        class="form__element form__element--half form__element--half-even form__select sf-select--underlined"
        name="countries"
        :label="$t('Country')"
        :required="true"
        :valid="!$v.shipping.country.$error"
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
        v-model.trim="shipping.phoneNumber"
        class="form__element"
        name="phone"
        :label="$t('Phone Number')"
      />
    </div>
    <SfHeading
      :title="$t('Shipping method')"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <div class="form__radio-group">
        <SfRadio
          v-for="method in shippingMethods"
          :key="method.method_code"
          v-model="shipping.shippingMethod"
          :value="method.method_code"
          name="shipping-method"
          class="form__element form__radio shipping"
          @input="changeShippingMethod()"
        >
          <template #label>
            <div class="sf-radio__label shipping__label">
              {{ method.method_title }} | {{ method.amount | price }}
            </div>
          </template>
        </SfRadio>
      </div>
      <div class="form__action">
        <SfButton
          class="sf-button--full-width form__action-button"
          :disabled="$v.shipping.$invalid || !shippingMethods.length"
          @click="sendDataToCheckout"
        >
          {{ $t("Continue to payment") }}
        </SfButton>
        <SfButton
          class="sf-button--full-width sf-button--text form__action-button form__action-button--secondary"
          @click="$bus.$emit('checkout-before-edit', 'personalDetails')"
        >
          {{ $t("Edit personal details") }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { required, minLength } from 'vuelidate/lib/validators';
import {
  unicodeAlpha,
  unicodeAlphaNum
} from '@vue-storefront/core/helpers/validators';
import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfSelect,
  SfHeading,
  SfCheckbox
} from '@storefront-ui/vue';
export default {
  name: 'OShipping',
  components: {
    SfInput,
    SfRadio,
    SfButton,
    SfSelect,
    SfHeading,
    SfCheckbox
  },
  mixins: [Shipping],
  validations: {
    shipping: {
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
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

.title {
  margin-bottom: var(--spacer-extra-big);
}
.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
  }
  &__element {
    margin-bottom: var(--spacer-extra-big);
    @include for-desktop {
      flex: 0 0 100%;
    }
    &--half {
      @include for-desktop {
        flex: 1 1 50%;
      }
      &-even {
        @include for-desktop {
          padding-left: var(--spacer-extra-big);
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
      margin: var(--spacer-big) 0;
      @include for-desktop {
        order: -1;
        margin: 0;
        text-align: left;
      }
    }
  }
  &__radio {
    margin-bottom: 0;
    &-group {
      flex: 0 0 100%;
      margin: 0 0 var(--spacer-extra-big) 0;
    }
  }
}
.shipping {
  margin: 0 -#{var(--spacer-big)};
  &__label {
    display: flex;
    justify-content: space-between;
  }
  &__description {
    width: 100%;
    margin-top: 0;
  }
  &__delivery {
    color: var(--c-text-muted);
  }
  &__action {
    align-items: center;
    margin-left: var(--spacer);
    text-decoration: none;
    &::before {
      content: "+";
    }
    &--is-active {
      color: var(--c-primary);
      &::before {
        content: "-";
      }
    }
  }
  &__info {
    margin-top: var(--spacer);
  }
}
</style>
