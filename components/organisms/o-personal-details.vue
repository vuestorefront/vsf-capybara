<template>
  <div class="o-personal-details">
    <div v-if="!currentUser" class="log-in desktop-only">
      <SfButton class="log-in__button color-secondary" @click="login">
        {{ $t('Log in to your account') }}
      </SfButton>
      <p class="log-in__info">
        {{ $t('or fill the details below') }}:
      </p>
    </div>
    <SfHeading
      :title="`1. ${$t('Details')}`"
      :level="2"
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
      <div class="info">
        <p class="info__heading">
          {{ $t('Enjoy these perks with your free account!') }}
        </p>
        <SfCharacteristic
          v-for="({ description, icon }, index) in characteristics"
          :key="index"
          :description="description"
          :icon="icon"
          size-icon="xxs"
          class="info__characteristic"
        />
      </div>
      <template v-if="!currentUser">
        <div class="form__element">
          <SfCheckbox
            v-model="createAccount"
            :label="$t('I want to create an account')"
            class="form__checkbox"
            name="createAccount"
          />
        </div>
        <template v-if="createAccount">
          <SfInput
            v-model="password"
            type="password"
            class="form__element"
            name="password"
            :has-show-password="true"
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
            :has-show-password="true"
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
                <span class="sf-checkbox__label no-flex">
                  {{ $t("I accept ") }}
                </span>
                <SfButton class="sf-button sf-button--text terms" @click.prevent="openTermsAndConditionsModal">
                  {{ $t("Terms and conditions") }}
                </SfButton>
              </template>
            </SfCheckbox>
          </div>
        </template>
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
          class="sf-button--full-width sf-button--text form__action-button form__action-button--secondary mobile-only"
          @click="login"
        >
          {{ $t("or login to your account") }}
        </SfButton>
      </div>
    </div>
  </div>
</template>
<script>
import { required, minLength, email, sameAs } from 'vuelidate/lib/validators';
import { PersonalDetails } from '@vue-storefront/core/modules/checkout/components/PersonalDetails';
import { SfInput, SfButton, SfHeading, SfCheckbox, SfCharacteristic } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { mapActions } from 'vuex';

export default {
  name: 'OPersonalDetails',
  components: {
    SfInput,
    SfButton,
    SfHeading,
    SfCheckbox,
    SfCharacteristic
  },
  mixins: [PersonalDetails],
  data () {
    return {
      characteristics: [
        {
          description: this.$t('Faster checkout'),
          icon: 'clock'
        },
        {
          description: this.$t('Full rewards program benefits'),
          icon: 'rewards'
        },
        {
          description: this.$t('Earn credits with every purchase'),
          icon: 'credits'
        },
        {
          description: this.$t('Manage your wishlist'),
          icon: 'heart'
        }
      ]
    };
  },
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
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    login () {
      this.openModal({ name: ModalList.Auth, payload: 'login' })
    },
    openTermsAndConditionsModal () {
      this.openModal({ name: ModalList.TermsAndConditions })
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
  }
}
.log-in {
  &__info {
    margin: var(--spacer-lg) 0;
    color: var(--c-dark-variant);
    font: var(--font-light) var(--font-base) / 1.6 var(--font-family-primary);
    @include for-desktop {
      font-weight: var(--font-normal);
      font-size: var(--font-sm);
    }
  }
  &__button {
    margin: var(--spacer-2xl) 0 var(--spacer-xl) 0;
  }
}
.info {
  margin: 0 0 var(--spacer-xl) 0;
  flex: 1;
  &__heading {
    font-family: var(--font-family-primary);
    font-weight: var(--font-light);
  }
  &__characteristic {
    --characteristic-description-font-size: var(--font-xs);
    margin: 0 0 var(--spacer-sm) var(--spacer-2xs);
  }
  @include for-desktop {
    margin: 0;
    &__heading {
      margin: 0 0 var(--spacer-sm) 0;
      font-size: var(--font-xs);
    }
    &__characteristic {
      margin: var(--spacer-base) 0;
    }
  }
}
.form {
  &__checkbox {
    margin: var(--spacer-base) 0;
  }
  &__action {
    margin: var(--spacer-sm) 0;
    &-button {
      &:first-child {
        --button-height: 4.0625rem;
      }
      &--secondary {
        margin: var(--spacer-base) 0;
      }
    }
  }
  @include for-mobile {
    &__checkbox {
      --checkbox-font-family: var(--font-family-primary);
      --checkbox-font-weight: var(--font-light);
      --checkbox-font-size: var(--font-sm);
    }
  }
  @include for-desktop {
    margin: 0 var(--spacer-2xl) 0 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    &__element {
      margin: 0 0 var(--spacer-base) 0;
      flex: 0 0 100%;
      &--half {
        flex: 1 1 50%;
        &-even {
          padding: 0 0 0 var(--spacer-lg);
        }
      }
    }
  }
  .terms {
    margin: 0 0 0 0.4em;
  }
}
.no-flex {
  flex: unset;
}
</style>
