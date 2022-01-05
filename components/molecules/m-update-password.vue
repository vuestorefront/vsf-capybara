<template>
  <div class="m-update-password">
    <p class="message">
      {{ $t('If you want to change the password to access your account, enter the following information:') }}<br>
      <template v-if="currentUser">
        {{ $t('Your current email address is') }}
        <span>{{ typeof currentUser.email !== 'undefined' ? currentUser.email : '' }}</span>
      </template>
    </p>

    <div class="form">
      <SfInput
        v-model="oldPassword"
        type="password"
        class="current-password"
        name="currentPassword"
        :label="$t('Current Password')"
        required
        :valid="!$v.oldPassword.$error"
        :error-message="$t('Field is required.')"
      />
      <SfInput
        v-model="password"
        type="password"
        class="new-password"
        name="newPassword"
        :label="$t('New Password')"
        required
        :valid="!$v.password.$error"
        :error-message="$t('Field is required.')"
      />
      <SfInput
        v-model="rPassword"
        type="password"
        class="repeat-password"
        name="repeatPassword"
        :label="$t('Repeat Password')"
        required
        :valid="!$v.rPassword.$error"
        :error-message="
          !$v.rPassword.required
            ? $t('Field is required.')
            : $t('Passwords must be identical.')
        "
      />

      <SfButton class="action" @click.native="updatePassword">
        {{ $t('Update password') }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { SfInput, SfButton } from '@storefront-ui/vue';
import { required, sameAs } from 'vuelidate/lib/validators';

export default {
  name: 'MUpdatePassword',
  components: {
    SfInput,
    SfButton
  },
  data () {
    return {
      oldPassword: '',
      password: '',
      rPassword: ''
    }
  },
  computed: {
    currentUser () {
      return this.$store.state.user.current
    }
  },
  methods: {
    updatePassword () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'danger',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        });
        return;
      }
      this.$bus.$emit('myAccount-before-changePassword', {
        currentPassword: this.oldPassword,
        newPassword: this.password
      })
    }
  },
  validations: {
    oldPassword: {
      required
    },
    password: {
      required
    },
    rPassword: {
      required,
      sameAsPassword: sameAs('password')
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
  grid: "current" "new" "repeat";
  grid-gap: var(--spacer-base) var(--spacer-lg);
  align-items: center;
}

.current-password { grid-area: current; }

.new-password { grid-area: new; }

.repeat-password { grid-area: repeat; }

@include for-desktop {
  .form {
    grid: "current  current"
          "new      repeat";
  }

  .action {
    width: max-content;
  }
}
</style>
