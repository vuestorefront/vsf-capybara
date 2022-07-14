<template>
  <div class="storyblok-mailing-list-subscribe-form" :style="styles" :class="cssClasses">
    <m-mailing-list-subscription
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

import MMailingListSubscription from 'theme/components/molecules/m-mailing-list-subscription.vue';

import MailListSubscriptionFormData from './interfaces/mailing-list-subscription-form-data.interface';

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokMailingListSubscribeForm',
  components: {
    MMailingListSubscription
  },
  inject: {
    componentWidthCalculator: { }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    itemData (): MailListSubscriptionFormData {
      return this.item as MailListSubscriptionFormData;
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
