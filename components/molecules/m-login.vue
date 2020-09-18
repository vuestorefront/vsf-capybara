<template>
  <div class="m-login modal-content">
    <form @submit.prevent="login" class="form">
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
        class="form__element"
      />
      <SfInput
        v-model="password"
        name="password"
        :label="$t('Password')"
        :required="true"
        :valid="!$v.password.$error"
        :error-message="$t('Field is required.')"
        type="password"
        class="form__element"
      />
      <SfCheckbox
        v-model="rememberMe"
        name="remember-me"
        :label="$t('Remember me')"
        class="form__element form__checkbox"
      />
      <SfButton class="sf-button--full-width form__submit">
        {{ $t("Login") }}
      </SfButton>
    </form>
    <SfButton class="sf-button--text action-button" @click.native="switchElem('forgot-pass')">
      {{ $t("Forgotten password?") }}
    </SfButton>
    <div class="aside">
      <SfHeading
        :title="$t('Don\'t have an account yet?')"
        :level="3"
        class="aside__heading"
      />
      <SfButton class="sf-button--text" @click.native="switchElem('register')">
        {{ $t("Register now") }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import { Logger } from '@vue-storefront/core/lib/logger';
import { required, email } from 'vuelidate/lib/validators';
import { SfInput, SfButton, SfCheckbox, SfHeading } from '@storefront-ui/vue';
import { mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'MLogin',
  components: { SfInput, SfButton, SfCheckbox, SfHeading },
  data () {
    return {
      email: '',
      password: '',
      rememberMe: false
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal',
      closeModal: 'closeModal'
    }),
    switchElem (to) {
      this.$v.$reset();
      this.openModal({ name: ModalList.Auth, payload: to })
    },
    login () {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'danger',
          message: this.$t('Please fix the validation errors'),
          action1: { label: this.$t('OK') }
        });
        return;
      }
      this.$bus.$emit(
        'notification-progress-start',
        this.$t('Authorization in progress ...')
      );
      this.$store
        .dispatch('user/login', {
          username: this.email,
          password: this.password
        })
        .then(result => {
          this.$bus.$emit('notification-progress-stop', {});

          if (result.code !== 200) {
            this.onFailure(result);
          } else {
            this.onSuccess(i18n.t('You are logged in!'));
            this.closeModal({ name: ModalList.Auth });
          }
        })
        .catch(err => {
          Logger.error(err, 'user')();
          this.onFailure({
            result:
              'Unexpected authorization error. Check your Network conection.'
          });
          this.$bus.$emit('notification-progress-stop');
        });
    },
    onSuccess (message) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'success',
        message: message,
        action1: { label: i18n.t('OK') }
      });
    },
    onFailure (result) {
      this.$store.dispatch('notification/spawnNotification', {
        type: 'danger',
        message: i18n.t(result.result),
        action1: { label: i18n.t('OK') }
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
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-content,
.aside {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form {
  width: 100%;
  &__element {
    margin: var(--spacer-base) 0;
  }
  &__checkbox {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
  &__submit {
    margin: var(--spacer-xl) 0 0 0;
  }
}
.action-button {
  margin: var(--spacer-xl) 0;
}
.aside {
  margin: 0 0 var(--spacer-xl) 0;
  &__heading {
    --heading-title-color: var(--c-primary);
    margin: 0 0 var(--spacer-sm) 0;
  }
}
</style>
