<template>
  <div>
    <header class="modal-header py25 px65 h1 serif weight-700 bg-cl-secondary">
      {{ $t("Register") }}
      <i
        slot="close"
        class="modal-close material-icons cl-bg-tertiary"
        @click="close"
      >
        close
      </i>
    </header>

    <div class="modal-content bg-cl-primary pt30 pb60 px65 cl-secondary">
      <form novalidate @submit.prevent="register">
        <base-input
          v-model="email"
          class="mb10"
          type="email"
          name="email"
          autocomplete="email"
          focus
          :placeholder="$t('E-mail address *')"
          :validations="[
            {
              condition: !$v.email.required && $v.email.$error,
              text: $t('Field is required.')
            },
            {
              condition: !$v.email.email && $v.email.$error,
              text: $t('Please provide valid e-mail address.')
            }
          ]"
          @blur="$v.email.$touch()"
        />
        <div class="row mb10">
          <base-input
            v-model="firstName"
            class="col-xs-6"
            type="text"
            name="first-name"
            autocomplete="given-name"
            :placeholder="$t('First name *')"
            :validations="[
              {
                condition: !$v.firstName.required && $v.firstName.$error,
                text: $t('Field is required.')
              },
              {
                condition: !$v.firstName.minLength,
                text: $t('Name must have at least 2 letters.')
              }
            ]"
            @blur="$v.firstName.$touch()"
          />
          <base-input
            v-model="lastName"
            class="col-xs-6"
            type="text"
            name="last-name"
            autocomplete="last-name"
            :placeholder="$t('Last name *')"
            :validations="[
              {
                condition: !$v.lastName.required && $v.lastName.$error,
                text: $t('Field is required.')
              }
            ]"
            @blur="$v.lastName.$touch()"
          />
        </div>
        <base-input
          ref="password"
          v-model="password"
          class="mb10"
          type="password"
          name="password"
          autocomplete="new-password"
          :placeholder="$t('Password *')"
          :validations="[
            {
              condition: !$v.password.required && $v.password.$error,
              text: $t('Field is required.')
            },
            {
              condition: !$v.password.minLength && $v.password.$error,
              text: $t('Password must have at least 8 letters.')
            }
          ]"
          @blur="$v.password.$touch()"
        />
        <base-input
          v-model="rPassword"
          class="mb10"
          type="password"
          name="password-confirm"
          autocomplete="new-password"
          :placeholder="$t('Repeat password *')"
          :validations="[
            {
              condition: !$v.rPassword.required && $v.rPassword.$error,
              text: $t('Field is required.')
            },
            {
              condition: !$v.rPassword.sameAsPassword && $v.rPassword.$error,
              text: $t('Passwords must be identical.')
            }
          ]"
          @blur="$v.rPassword.$touch()"
        />
        <base-checkbox
          id="terms"
          v-model="conditions"
          class="mb10"
          :validations="[
            {
              condition: !$v.conditions.required && $v.conditions.$error,
              text: $t('You must accept the terms and conditions.')
            }
          ]"
          @blur="$v.conditions.$reset()"
          @change="$v.conditions.$touch()"
        >
          {{ $t("I accept terms and conditions") }} *
        </base-checkbox>
        <button-full class="mb20" type="submit">
          {{ $t("Register an account") }}
        </button-full>
        <div class="center-xs">
          <span>
            {{ $t("or") }}
            <a href="#" @click.prevent="switchElem">
              {{ $t("login to your account") }}
            </a>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>
<script>
import Register from "@vue-storefront/core/compatibility/components/blocks/Auth/Register";
import ButtonFull from "theme/components/theme/ButtonFull.vue";
import BaseCheckbox from "theme/components/core/blocks/Form/BaseCheckbox.vue";
import BaseInput from "theme/components/core/blocks/Form/BaseInput.vue";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";

export default {
  validations: {
    email: {
      required,
      email
    },
    firstName: {
      minLength: minLength(2),
      required
    },
    lastName: {
      required
    },
    password: {
      minLength: minLength(8),
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs("password")
    },
    conditions: {
      required
    }
  },
  components: {
    ButtonFull,
    BaseCheckbox,
    BaseInput
  },
  mixins: [Register],
  methods: {
    register() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        this.$store.dispatch("notification/spawnNotification", {
          type: "error",
          message: this.$t("Please fix the validation errors"),
          action1: { label: this.$t("OK") }
        });
        return;
      }
      this.callRegister();
    },
    onSuccess() {
      this.$store.dispatch("notification/spawnNotification", {
        type: "success",
        message: this.$t("You are logged in!"),
        action1: { label: this.$t("OK") }
      });
    },
    onFailure(result) {
      this.$store.dispatch("notification/spawnNotification", {
        type: "error",
        message: this.$t(result.result),
        action1: { label: this.$t("OK") }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-close {
  cursor: pointer;
}
.modal-content {
  @media (max-width: 400px) {
    padding-left: 20px;
    padding-right: 20px;
  }
}
</style>
