<template>
  <div class="m-mailing-list-subscription">
    <m-subscription-form
      :name="name"
      :button-text="buttonText"
      :success-message="successMessage"
      :subscribe-action="createMailingListSubscription"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import Task from '@vue-storefront/core/lib/sync/types/Task';

import MSubscriptionForm from './m-subscription-form.vue';

export default Vue.extend({
  name: 'MMailingListSubscription',
  components: {
    MSubscriptionForm
  },
  props: {
    name: {
      type: String,
      default: 'mailing-list-subscription-form'
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
  methods: {
    createMailingListSubscription (email: string): Promise<Task> {
      return this.$store.dispatch('budsies/createMailingListSubscription', {
        email,
        listId: this.listId
      })
    }
  }
});
</script>
