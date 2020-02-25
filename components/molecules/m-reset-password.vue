<template>
  <div class="m-reset-password" key="reset-password">
    <div class="form" v-if="!passwordSent">
      <p class="form__message">
        {{ $t('Enter your email to receive instructions on how to reset your password.') }}
      </p>
      <form @submit.prevent="resetPassword">
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
        <SfButton class="sf-button--full-width form__button" @click.native="resetPassword">
          {{ $t("Reset password") }}
        </SfButton>
      </form>
    </div>
    <div v-else>
      <p class="form__message">
        {{ $t('We\'ve sent password reset instructions to your email. Check your inbox and follow the link.') }}
      </p>
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
      this.openModal({name: ModalList.Auth, payload: to})
    },
    resetPassword () {
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
  &__message {
    margin-bottom: $spacer-extra-big;
    font-size: 0.9rem;
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
