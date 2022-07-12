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
  data () {
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
    async subscribe (email: string): Promise<void> {
      if (this.isSubmitting) {
        return;
      }

      this.errorMessage = '';
      this.isSubmitting = true;

      try {
        const response = await this.$store.dispatch('budsies/createNewsletterSubscription', {
          email
        })

        if (response.result.errorMessage) {
          this.errorMessage = response.result.errorMessage;
          return;
        }

        if (Number.parseInt(response.resultCode, 10) !== 200) {
          return;
        }

        this.isSuccessSubscribed = true;
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>
