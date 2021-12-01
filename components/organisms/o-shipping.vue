<template>
  <div class="o-shipping">
    <SfHeading
      :title="`2. ${$t('Shipping')}`"
      :level="2"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <SfCheckbox
        v-if="currentUser && hasShippingDetails()"
        v-model="shipToMyAddress"
        class="form__element form__checkbox"
        name="shipToMyAddress"
        :label="$t('Ship to my default address')"
      />
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
        :label="$t('Address')"
        :required="true"
        :valid="!$v.shipping.streetAddress.$error"
        :error-message="$t('Field is required')"
        @blur="$v.shipping.streetAddress.$touch()"
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
        v-if="!isSelectedCountryHasStates"
        v-model.trim="shipping.state"
        class="form__element form__element--half form__element--half-even"
        name="state"
        :label="$t('State / Province')"
      />
      <MMultiselect
        v-if="isSelectedCountryHasStates && canShowStateSelector"
        v-model.trim="shipping.state"
        class="form__element form__element--half form__element--half-even form__select"
        name="state"
        :label="$t('State / Province')"
        :required="true"
        id-field="code"
        label-field="name"
        :options="getStatesForSelectedCountry"
        :valid="!$v.shipping.state.$error"
        :error-message="$t('Field is required')"
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
        @blur="onZipCodeBlur"
      />
      <MMultiselect
        v-model="shipping.country"
        class="form__element form__element--half form__element--half-even form__select"
        name="countries"
        :label="$t('Country')"
        :required="true"
        id-field="code"
        label-field="name"
        :options="countries"
        :valid="!$v.shipping.country.$error"
        :error-message="$t('Field is required')"
        @change="changeCountry"
      />
      <SfInput
        v-model.trim="shipping.phoneNumber"
        class="form__element"
        name="phone"
        :label="$t('Phone Number')"
      />
    </div>
    <SfHeading
      :title="$t('Shipping method')"
      :level="3"
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
          class="form__radio shipping"
          @input="changeShippingMethod()"
        >
          <template #label>
            <div class="sf-radio__label shipping__label">
              <div>{{ method.method_title }}</div>
              <div class="shipping__label-price">
                {{ method.amount | price }}
              </div>
            </div>
          </template>
          <template #details v-if="method.method_name">
            <p>{{ method.method_name }}</p>
          </template>
        </SfRadio>
        <p class="shipping__note">
          {{ $t('Our service is not responsible for local tariffs or duties on international shipments') }}
        </p>
      </div>
      <div class="form__action">
        <SfButton
          class="sf-button--full-width form__action-button"
          :disabled="$v.shipping.$invalid || !shippingMethods.length"
          @click="saveDataToCheckout"
        >
          {{ $t("Continue to payment") }}
        </SfButton>
        <SfButton
          class="sf-button--full-width sf-button--text form__action-button form__action-button--secondary"
          @click="$bus.$emit('checkout-before-edit', 'personalDetails')"
        >
          {{ $t("Edit Details") }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { required, requiredIf, minLength } from 'vuelidate/lib/validators';
import { unicodeAlpha, unicodeAlphaNum } from '@vue-storefront/core/helpers/validators';
import { Shipping } from '@vue-storefront/core/modules/checkout/components/Shipping';
import {
  SfInput,
  SfRadio,
  SfButton,
  SfHeading,
  SfCheckbox
} from '@storefront-ui/vue';
import { createSmoothscroll } from 'theme/helpers';
import MMultiselect from 'theme/components/molecules/m-multiselect';
const States = require('@vue-storefront/i18n/resource/states.json');

export default {
  name: 'OShipping',
  components: {
    SfInput,
    SfRadio,
    SfButton,
    SfHeading,
    SfCheckbox,
    MMultiselect
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
      state: {
        required: requiredIf(function () { return this.isSelectedCountryHasStates })
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
      }
    }
  },
  data: () => {
    return {
      states: States,
      fCanShowStateSelector: true,
      fZipCodeChanged: false
    };
  },
  computed: {
    isSelectedCountryHasStates () {
      if (!this.shipping.country || !this.states) {
        return false;
      }

      return this.states.hasOwnProperty(this.shipping.country);
    },
    getStatesForSelectedCountry () {
      if (!this.isSelectedCountryHasStates) {
        return [];
      }

      return this.states[this.shipping.country];
    },
    canShowStateSelector () {
      return this.fCanShowStateSelector
    },
    getShippingCountry () {
      return this.shipping.country;
    },
    getZipCode () {
      return this.shipping.zipCode;
    }
  },
  methods: {
    onZipCodeBlur () {
      this.$v.shipping.zipCode.$touch();

      if (this.fZipCodeChanged) {
        this.fZipCodeChanged = false;
      } else {
        return;
      }

      if (this.$v.shipping.country.$invalid) {
        return;
      }

      if (this.$v.shipping.zipCode.$invalid) {
        return;
      }

      this.$bus.$emit('checkout-before-shippingMethods', this.shipping.country)
    },
    saveDataToCheckout () {
      this.sendDataToCheckout();
      this.$store.dispatch('cart/syncTotals', { forceServerSync: true });
    }
  },
  mounted () {
    createSmoothscroll(document.documentElement.scrollTop || document.body.scrollTop, 0);
  },
  watch: {
    getShippingCountry: {
      handler (after, before) {
        this.fCanShowStateSelector = false;

        if (after && before) {
          this.shipping.state = '';
        }

        this.$nextTick(() => {
          this.fCanShowStateSelector = true;
        })
      },
      immediate: true
    },
    getZipCode: {
      handler () {
        this.fZipCodeChanged = true;
      },
      immediate: true
    }
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
      --heading-padding: var(--spacer-xs) 0 var(--spacer-base) 0;
    }
  }
}
.form {
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
  &__button {
    --button-width: 100%;
  }
  &__radio-group {
    flex: 0 0 100%;
  }
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin: 0 var(--spacer-2xl) 0 0;
    &:last-of-type {
      margin: 0 calc(var(--spacer-2xl) - var(--spacer-sm)) 0 0;
    }
    &__element {
      margin: 0 0 var(--spacer-sm) 0;
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
    &__button {
      --button-width: auto;
    }
    &__radio-group {
      margin: 0 calc(var(--spacer-sm) * -1);
    }
  }
}
.shipping {
  --radio-container-padding: var(--spacer-sm);
  &__note {
    font-size: var(--font-sm);
    color: var(--c-dark-variant);
  }
  &__label {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
    &-price {
      font-size: var(--font-lg);
      @include for-mobile {
        order: -1;
        margin: 0 var(--spacer-xs) 0 0;
      }
    }
  }
  &__description {
    --radio-description-margin: 0;
  }
  &__delivery {
    color: var(--c-text-muted);
    display: flex;
  }
  &__action {
    @include for-mobile {
      margin: 0 0 0 var(--spacer-xs);
    }
    &::before {
      content: "+";
    }
    &--is-active {
      --button-color: var(--c-primary);
      --button-transition: color 150ms linear;
      &::before {
        content: "-";
      }
    }
  }
  @include for-desktop {
    &__label {
      justify-content: space-between;
    }
    &__delivery {
      justify-content: space-between;
      max-width: 240px;
    }
  }
}
</style>
