<template>
  <div class="storyblok-mailchimp-subscribe-form" :style="styles" :class="cssClasses">
    <m-mailchimp-subscription
      :button-text="buttonText"
      :list-id="listId"
      :success-message="successMessage"
    />
  </div>
</template>

<script lang="ts">
import { VueConstructor } from 'vue';

import { Blok, ComponentWidthCalculator } from 'src/modules/vsf-storyblok-module';
import { InjectType } from 'src/modules/shared';

import MMailchimpSubscription from 'theme/components/molecules/m-mailchimp-subscription.vue';

import MailchimpSubscriptionFormData from './interfaces/mailchimp-subscription-form-data.interface';

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokMailchimpSubscribeForm',
  components: {
    MMailchimpSubscription
  },
  inject: {
    componentWidthCalculator: { }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    itemData (): MailchimpSubscriptionFormData {
      return this.item as MailchimpSubscriptionFormData;
    },
    buttonText (): string | undefined {
      return this.itemData.button_text;
    },
    listId (): string {
      return this.itemData.list_id;
    },
    successMessage (): string | undefined {
      return this.itemData.success_message;
    }
  }

})
</script>
