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
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import MSubscriptionForm from './m-subscription-form.vue';

export default Vue.extend({
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
        const response = await this.$store.dispatch('budsies/createMailchimpSubscription', {
          email,
          listId: this.listId
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
});
</script>
