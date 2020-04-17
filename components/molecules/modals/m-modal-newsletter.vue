<template>
  <SfModal :visible="isVisible" @close="closeModal" class="m-modal-newsletter">
    <div class="modal-content">
      <form @submit.prevent="subscribeExtend" class="form">
        <SfHeading
          class="sf-heading--left"
          :title="$t('Newsletter')"
          :subtitle="$t('Sign up to our newsletter and receive a coupon for 10% off!')"
          :level="3"
        />
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
          class="form__element"
        />
        <SfButton class="sf-button--full-width form__submit">
          {{ $t("Subscribe") }}
        </SfButton>
      </form>
    </div>
  </SfModal>
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
</style>
