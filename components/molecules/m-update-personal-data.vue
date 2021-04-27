<template>
  <div class="m-update-personal-data">
    <p class="message">
      {{ $t('Feel free to edit any of your details below so your account is always up to date') }}
    </p>

    <div class="form">
      <SfInput
        v-model="firstName"
        class="first-name"
        name="firstName"
        :label="$t('First Name')"
        required
        :valid="!$v.firstName.$error"
        :error-message="!$v.firstName.required ? $t('Field is required.') : $t('Name must have at least 2 letters.')"
      />
      <SfInput
        v-model="lastName"
        class="last-name"
        name="lastName"
        :label="$t('Last Name')"
        required
        :valid="!$v.lastName.$error"
        :error-message="$t('Field is required.')"
      />
      <SfInput
        v-model="email"
        type="email"
        class="email"
        name="email"
        :label="$t('Your e-mail')"
        required
        :valid="!$v.email.$error"
        :error-message="
          !$v.email.required
            ? $t('Field is required.')
            : $t('Please provide valid e-mail address.')
        "
      />

      <SfButton class="action" @click.native="updatePersonalData">
        {{ $t('Update personal data') }}
      </SfButton>
    </div>

    <p class="notice">
      {{ $t('At Brand name, we attach great importance to privacy issues and are committed to protecting the personal data of our users. Learn more about how we care and use your personal data in the') }}
      <a :href="localizedRoute('/privacy')">{{ $t('Privacy Policy') }}</a>.
    </p>
  </div>
</template>

<script>
import config from 'config';
import pick from 'lodash-es/pick';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { required, minLength, email } from 'vuelidate/lib/validators';
import { unicodeAlpha } from '@vue-storefront/core/helpers/validators';

export default {
  name: 'MUpdatePersonalData',
  components: {
    SfInput,
    SfButton
  },
  data () {
    return {
      firstName: '',
      lastName: '',
      email: ''
    }
  },
  methods: {
    updatePersonalData () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'danger',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        });
        return;
      }
      let updatedProfile = pick(JSON.parse(JSON.stringify(this.$store.state.user.current)), config.users.allowModification)
      updatedProfile.firstname = this.firstName
      updatedProfile.lastname = this.lastName
      updatedProfile.email = this.email
      this.$bus.$emit('myAccount-before-updateUser', updatedProfile)
    }
  },
  beforeMount () {
    // current user may not be available yet in beforeMount hook so vuex watcher is needed
    const unsubscribeFromStoreWatch = this.$store.watch(
      state => state.user.current,
      currentUser => {
        if (currentUser) {
          this.firstName = currentUser.firstname;
          this.lastName = currentUser.lastname;
          this.email = currentUser.email;
        }
      },
      { immediate: true });

    this.$once('hook:beforeDestroy', unsubscribeFromStoreWatch)
  },
  validations: {
    firstName: {
      required,
      minLength: minLength(2),
      unicodeAlpha
    },
    lastName: {
      required,
      unicodeAlpha
    },
    email: {
      required,
      email
    }
  }
};
</script>

<style lang="scss" scoped>

@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.message {
  color: var(--c-dark-variant);
  line-height: 1.4;
  margin: 0 0 var(--spacer-xl) 0;
}

.form {
  display: grid;
  grid: "fn" "ln" "email";
  grid-gap: var(--spacer-base) var(--spacer-lg);
  align-items: center;
}

.first-name { grid-area: fn; }

.last-name { grid-area: ln; }

.email { grid-area: email; }

.notice {
  font: var(--font-light) var(--font-sm) / 1.4 var(--font-family-primary);
  margin-top: var(--spacer-xl);
}

a {
  color: var(--c-primary);
  &:hover {
    color: var(--c-primary-variant);
  }
}

@include for-desktop {
  .form {
    grid: "fn    ln"
          "email email" ;
  }

  .action {
  width: max-content;
  }
}
</style>
