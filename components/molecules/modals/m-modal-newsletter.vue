<template>
  <div class="m-modal-newsletter">
    <SfModal :visible="isVisible" @close="closeModal">
      <SfHeading
        class="sf-heading--left"
        :title="$t('Newsletter')"
        :subtitle="$t('Sign up to our newsletter and receive a coupon for 10% off!')"
      />
      <div class="form">
        <SfInput
          v-model="email"
          name="email"
          :label="$t('E-mail address')"
          :required="true"
          :valid="!$v.email.$error"
          :error-message="
            !$v.email.required
              ? $t('Field is required.')
              : $t('Please provide valid e-mail address.')
          "
          class="form__input"
        />
        <SfButton class="sf-button--full-width form__button" @click.native="subscribeExtend">
          {{ $t("Subscribe") }}
        </SfButton>
      </div>
    </SfModal>
  </div>
</template>

<script>
import i18n from '@vue-storefront/i18n';
import SubscriptionStatus from '@vue-storefront/core/modules/newsletter/mixins/SubscriptionStatus'
import Subscribe from '@vue-storefront/core/modules/newsletter/mixins/Subscribe'
import { required, email } from 'vuelidate/lib/validators';
import { SfModal, SfHeading, SfInput, SfButton } from '@storefront-ui/vue';

export default {
  name: 'MModalNewsletter',
  components: { SfModal, SfHeading, SfInput, SfButton },
  mixins: [ SubscriptionStatus, Subscribe ],
  props: {
    isVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    modalData: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },
  data () {
    return {
      email: ''
    };
  },
  methods: {
    closeModal () {
      this.$emit('close', this.modalData.name)
    },
    subscribeExtend () {
      this.$v.$touch();
      if (this.$v.$invalid) return
      this.subscribe(this.onSuccesfulSubmission)
    },
    onSuccesfulSubmission (isSubscribed) {
      if (isSubscribed) {
        this.$store.dispatch('notification/spawnNotification', {
          type: 'success',
          message: i18n.t('You have been successfully subscribed to our newsletter!'),
          action1: { label: i18n.t('OK') }
        })
      }
      this.closeModal()
    }
  },
  validations: {
    email: {
      required,
      email
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  &__input {
    margin-top: var(--spacer-xl);
  }
  &__button {
    margin-top: var(--spacer-2xl);
  }
}
</style>
