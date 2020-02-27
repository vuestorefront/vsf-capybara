<template>
  <div class="m-login" key="log-in">
    <div class="form">
      <form @submit.prevent="login">
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
          v-model="rememberMe"
          name="remember-me"
          :label="$t('Remember me')"
          class="form__checkbox"
        />
        <SfButton class="sf-button--full-width form__button" @click.native="login">
          {{ $t("Login") }}
        </SfButton>
      </form>
    </div>
    <div class="action">
      <SfButton class="sf-button--text button--muted" @click.native="switchElem('forgot-pass')">
        {{ $t("Forgotten password?") }}
      </SfButton>
    </div>
    <div class="bottom">
      {{ $t("Don't have and account yet?") }}
      <SfButton class="sf-button--text" @click.native="switchElem('register')">
        {{ $t("Register today") }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { Logger } from '@vue-storefront/core/lib/logger';
import { required, email } from 'vuelidate/lib/validators';
import { SfInput, SfButton, SfCheckbox } from '@storefront-ui/vue';
import { mapActions } from 'vuex';
import { ModalList } from 'theme/store/ui/modals'

export default {
  name: 'MLogin',
  components: { SfInput, SfButton, SfCheckbox },
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
      this.openModal({name: ModalList.Auth, payload: to})
    },
    login () {
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
            this.onSuccess(this.$t('You are logged in!'));
            this.closeModal({name: ModalList.Auth});
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
