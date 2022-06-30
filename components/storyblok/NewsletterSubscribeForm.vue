<template>
  <div class="storyblok-newsletter-subscribe-form" :style="styles" :class="cssClasses">
    <MNewsletterSubscription
      name="storyblock-newsletter-subscription-form"
    />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';

import MNewsletterSubscription from 'theme/components/molecules/m-newsletter-subscription.vue';

export default Blok.extend({
  name: 'StoryblokNewsletterSubscribeForm',
  components: {
    MNewsletterSubscription
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.storyblok-newsletter-subscribe-form {
  @include display-property-handling;
}
</style>
