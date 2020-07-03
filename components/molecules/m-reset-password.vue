<template>
  <div class="m-reset-password modal-content">
    <template v-if="!passwordSent">
      <p>
        {{ $t('Enter your email to receive instructions on how to reset your password.') }}
      </p>
      <form @submit.prevent="resetPassword" class="form">
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
        <SfButton class="sf-button--full-width form__submit">
          {{ $t("Reset password") }}
        </SfButton>
      </form>
    </template>
    <div v-else>
      <p>
        {{ $t('We\'ve sent password reset instructions to your email. Check your inbox and follow the link.') }}
      </p>
    </div>
    <SfButton class="sf-button--text action-button" @click.native="switchElem('login')">
      {{ `${$t("or")} ${$t("login in to your account")}` }}
    </SfButton>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import { Logger } from '@vue-storefront/core/lib/logger';
import { required, email } from 'vuelidate/lib/validators';
import { SfInput, SfButton } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { mapActions } from 'vuex';

export default {
  name: 'MResetPassword',
  components: { SfInput, SfButton },
  data () {
    return {
      email: '',
      passwordSent: false
    };
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    switchElem (to) {
      this.$v.$reset();
      this.openModal({ name: ModalList.Auth, payload: to })
    },
    resetPassword () {
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
        this.$t('Resetting the password ... ')
      );
      this.$store
        .dispatch('user/resetPassword', { email: this.email })
        .then(response => {
          this.$bus.$emit('notification-progress-stop');
          if (response.code === 200) {
            this.passwordSent = true;
          } else {
            this.onFailure(response);
          }
        })
        .catch(() => {
          this.$bus.$emit('notification-progress-stop');
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
    }
  }
}
</script>

<style lang="scss" scoped>
.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.form {
  width: 100%;
  &__element {
    margin: var(--spacer-base) 0;
  }
  &__submit {
    margin: var(--spacer-xl) 0 0 0;
  }
}
.action-button {
  margin: var(--spacer-xl) 0;
}
</style>
