<template>
  <div class="m-newsletter-subscription">
    <m-subscription-form
      :name="name"
      :subscribe-action="createNewsletterSubscription"
    >
      <slot />
    </m-subscription-form>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@vue-storefront/core/lib/sync/types/Task';

import MSubscriptionForm from './m-subscription-form.vue';

export default Vue.extend({
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
  methods: {
    createNewsletterSubscription (email: string): Promise<Task> {
      return this.$store.dispatch('budsies/createNewsletterSubscription', {
        email
      })
    }
  }
});
</script>
