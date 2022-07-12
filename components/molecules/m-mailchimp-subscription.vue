<template>
  <div class="m-mailchimp-subscription">
    <m-subscription-form
      :name="name"
      :is-submitting="isSubmitting"
      :is-success="isSuccessSubscribed"
      :error-message="errorMessage"
      :button-text="buttonText"
      :success-message="successMessage"
      @email-changed="onEmailChanged"
      @submit="subscribe"
    >
      <slot />
    </m-subscription-form>
  </div>
</template>

<script lang="ts">
import MSubscriptionForm from './m-subscription-form.vue';

export default {
  name: 'MMailchimpSubscription',
  components: {
    MSubscriptionForm
  },
  props: {
    name: {
      type: String,
      default: 'mailchimp-subscription-form'
    },
    buttonText: {
      type: String,
      default: undefined
    },
    successMessage: {
      type: String,
      default: undefined
    },
    listId: {
      type: String,
      default: '',
      required: true
    }
  },
  data (): Record<string, any> {
    return {
      isSubmitting: false,
      isSuccessSubscribed: false,
      errorMessage: ''
    };
  },
  methods: {
    onEmailChanged (): void {
      this.errorMessage = '';
    },
    subscribe (email: string): void {
      if (this.isSubmitting) {
        return;
      }

      this.errorMessage = '';
      this.isSubmitting = true;

      this.$store.dispatch('budsies/createMailchimpSubscription', {
        email,
        listId: this.listId
      }).then(res => {
        if (res.result.errorMessage) {
          this.errorMessage = res.result.errorMessage;
          return;
        }

        if (+res.resultCode !== 200) {
          return;
        }

        this.isSuccessSubscribed = true;
      }).finally(() => {
        this.isSubmitting = false;
      });
    }
  }
};
</script>
