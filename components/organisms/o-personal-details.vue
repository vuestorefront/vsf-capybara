<template>
  <div class="o-personal-details">
    <SfHeading
      :title="`1. ${$t('Personal Details')}`"
      class="sf-heading--left sf-heading--no-underline title"
    />
    <div class="form">
      <SfInput
        v-model.trim="personalDetails.firstName"
        class="form__element form__element--half"
        name="first-name"
        :label="$t('First name')"
        :required="true"
        :valid="!$v.personalDetails.firstName.$error"
        :error-message="
          !$v.personalDetails.firstName.required
            ? $t('Field is required')
            : $t('Name must have at least 2 letters.')
        "
        @blur="$v.personalDetails.firstName.$touch()"
      />
      <SfInput
        v-model.trim="personalDetails.lastName"
        class="form__element form__element--half form__element--half-even"
        name="last-name"
        :label="$t('Last name')"
        :required="true"
        :valid="!$v.personalDetails.lastName.$error"
        :error-message="$t('Field is required')"
        @blur="$v.personalDetails.lastName.$touch()"
      />
      <SfInput
        v-model.trim="personalDetails.emailAddress"
        class="form__element"
        name="email-address"
        :label="$t('Email address')"
        :required="true"
        :valid="!$v.personalDetails.emailAddress.$error"
        :error-message="
          !$v.personalDetails.emailAddress.required
            ? $t('Field is required')
            : $t('Please provide valid e-mail address.')
        "
        @blur="$v.personalDetails.emailAddress.$touch()"
      />
      <div class="form__element form__group">
        <SfCheckbox
          v-if="!currentUser"
          v-model="createAccount"
          class="form__element--half form__checkbox"
          name="createAccount"
        >
          <template #label>
            <span class="sf-checkbox__label">
              {{ $t("I want to create an account") }}
            </span>
            <AIconAccountBenefits class="ml20" />
          </template>
        </SfCheckbox>
      </div>
      <template v-if="createAccount && !currentUser">
        <SfInput
          v-model="password"
          type="password"
          class="form__element"
          name="password"
          :label="$t('Password')"
          :required="true"
          :valid="!$v.password.$error"
          :error-message="
            !$v.password.required
              ? $t('Field is required')
              : !$v.password.minLength
                ? $t('Password must have at least 8 letters.')
                : $t(
                  'Password must contain at least 3 different character classes: lower case, upper case, digits, special characters.'
                )
          "
          @blur="$v.password.$touch()"
        />
        <SfInput
          v-model="rPassword"
          type="password"
          class="form__element"
          name="password-confirm"
          :label="$t('Repeat password')"
          :required="true"
          :valid="!$v.rPassword.$error"
          :error-message="
            !$v.rPassword.required
              ? $t('Field is required')
              : $t('Passwords must be identical.')
          "
          @blur="$v.rPassword.$touch()"
        />
        <div class="form__element form__group">
          <SfCheckbox
            v-model="acceptConditions"
            class="form__element form__checkbox"
            name="acceptConditions"
            :required="true"
            @blur="$v.acceptConditions.$touch()"
          >
            <template #label>
              <div class="sf-checkbox__label">
                {{ $t("I accept ") }}
              </div>
              &nbsp;
              <ATermsAndConditions />
            </template>
          </SfCheckbox>
        </div>
      </template>
      <div class="form__action">
        <SfButton
          class="sf-button--full-width form__action-button"
          :disabled="createAccount ? $v.$invalid : $v.personalDetails.$invalid"
          @click="sendDataToCheckout"
        >
          {{
            $t(isVirtualCart ? "Continue to payment" : "Continue to shipping")
          }}
        </SfButton>
        <SfButton
          v-if="!currentUser"
          class="sf-button--full-width sf-button--text form__action-button form__action-button--secondary"
        >
          {{ $t("or") }}
          <span class="link pointer" @click="login">
            {{ $t("login to your account") }}
          </span>
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails';
import { SfInput, SfButton, SfHeading, SfCheckbox } from '@storefront-ui/vue';
import ATermsAndConditions from 'theme/components/atoms/a-terms-and-conditions';
import AIconAccountBenefits from 'theme/components/atoms/a-icon-account-benefits';

export default {
  name: 'OPersonalDetails',
  components: {
    SfInput,
    SfButton,
    SfHeading,
    SfCheckbox,
    ATermsAndConditions,
    AIconAccountBenefits
  },
  mixins: [PersonalDetails],
  validations: {
    personalDetails: {
      firstName: {
        required,
        minLength: minLength(2)
      },
      lastName: {
        required
      },
      emailAddress: {
        required,
        email
      }
    },
    password: {
      required,
      minLength: minLength(8),
      complex: value => {
        // Check if minimum 3 different classes of characters are used in password.
        // Classes of characters: lower case, upper case, digits and special characters.
        return (
          [
            /(?=[a-z])/.test(value),
            /(?=[A-Z])/.test(value),
            /(?=[0-9])/.test(value),
            /(?=\W)/.test(value)
          ].filter(result => result).length >= 3
        );
      }
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
    },
    acceptConditions: {
      required
    }
  },
  methods: {
    login () {
      this.$store.commit('ui/setAuthElem', 'login');
      this.$bus.$emit('modal-show', 'modal-signup');
    }
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
.title {
  margin-bottom: $spacer-extra-big;
}
.form {
  @include for-desktop {
    display: flex;
    flex-wrap: wrap;
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
  &__group {
    display: flex;
    align-items: center;
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
        margin: 0;
        text-align: right;
      }
    }
  }
}
.info {
  margin-left: $spacer-big;
  color: $c-text-muted;
  text-decoration: none;
}
</style>
