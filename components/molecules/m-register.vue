<template>
  <div class="m-register form" key="sign-up">
    <div class="from">
      <SfInput
        v-model="email"
        name="email"
        :label="$t('Your email')"
        :required="true"
        :valid="!$v.email.$error"
        :error-message="
          !$v.email.required
            ? $t('Field is required.')
            : $t('Please provide valid e-mail address.')
        "
        class="form__input"
      />
      <SfInput
        v-model="firstName"
        name="first-name"
        :label="$t('First Name')"
        :required="true"
        :valid="!$v.firstName.$error"
        :error-message="$t('Field is required.')"
        class="form__input"
      />
      <SfInput
        v-model="lastName"
        name="last-name"
        :label="$t('Last Name')"
        :required="true"
        :valid="!$v.lastName.$error"
        :error-message="$t('Field is required.')"
        class="form__input"
      />
      <SfInput
        v-model="password"
        name="password"
        :label="$t('Password')"
        :required="true"
        :valid="!$v.password.$error"
        :error-message="$t('Field is required.')"
        type="password"
        class="form__input"
      />
      <SfCheckbox
        v-model="createAccount"
        name="create-account"
        :label="$t('I want to create an account')"
        class="form__checkbox"
      />
      <SfButton
        class="sf-button--full-width form__button"
        @click.native="register"
      >
        {{ $t("Create an account") }}
      </SfButton>
    </div>
    <div class="action">
      {{ $t("or") }}
      <SfButton class="sf-button--text" @click.native="switchElem('login')">
        {{ $t("login in to your account") }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { Logger } from '@vue-storefront/core/lib/logger';
import { required, email } from 'vuelidate/lib/validators';
import { SfInput, SfButton, SfCheckbox } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { mapActions } from 'vuex';

export default {
  name: 'MRegister',
  components: { SfInput, SfButton, SfCheckbox },
  data () {
    return {
      email: '',
      password: '',
      createAccount: false,
      firstName: '',
      lastName: ''
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    switchElem (to) {
      this.$v.$reset();
      this.openModal({name: ModalList.Auth, payload: to})
    },
    register () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'error',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        });
        return;
      }
      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Registering the account ...')
      );
      this.$store
        .dispatch('user/register', {
          email: this.email,
          password: this.password,
          firstname: this.firstName,
          lastname: this.lastName
        })
        .then(result => {
          this.$bus.$emit('notification-progress-stop');
          if (result.code !== 200) {
            this.onFailure(result);
          } else {
            this.$store.dispatch('user/login', {
              username: this.email,
              password: this.password
            });
            this.onSuccess(this.$t('You are logged in!'));
            this.switchElem(null);
          }
        })
        .catch(err => {
          // TODO Move to theme
          this.onFailure({
            result:
              'Unexpected authorization error. Check your Network conection.'
          });
          this.$bus.$emit('notification-progress-stop');
          Logger.error(err, 'user')();
        });
    },
    onSuccess (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: message,
        action1: { label: this.$t('OK') }
      });
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'error',
        message: this.$t(result.result),
        action1: { label: this.$t('OK') }
      });
    }
  },
  validations: {
    email: {
      required,
      email
    },
    password: {
      required
    },
    firstName: {
      required
    },
    lastName: {
      required
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
.form {
  &__input {
    margin-bottom: $spacer-extra-big;
  }
  &__checkbox {
    margin-bottom: $spacer-big;
  }
  &__button {
    margin-top: $spacer-big;
  }
}
.action {
  margin-top: $spacer-big;
  text-align: center;
}
.bottom {
  padding-top: $spacer-extra-big;
  margin-top: $spacer-extra-big;
  border-top: 1px solid $c-light;
  line-height: 1.6;
  text-align: center;
}
.sf-button--muted {
  color: $c-text-muted;
}
</style>
