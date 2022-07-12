<template>
  <div class="m-newsletter-subscription">
    <m-subscription-form
      :name="name"
      :is-submitting="isSubmitting"
      :is-success="isSuccessSubscribed"
      :error-message="errorMessage"
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
  name: 'MNewsletterSubscription',
  components: {
    MSubscriptionForm
  },
  props: {
    name: {
      type: String,
      default: 'newsletter-subscription-form'
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

      this.$store.dispatch('budsies/createNewsletterSubscription', {
        email
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
