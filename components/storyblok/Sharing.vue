<template>
  <m-social-sharing
    class="storyblok-sharing"
    :class="cssClasses"
    :style="styles"
    :sharing-url="itemData.sharing_url.url"
    :sharing-description="itemData.sharing_description"
    :e-mail-subject="itemData.sharing_email_subject"
    :twitter-description="itemData.twitter_description"
    :image="itemData.sharing_image.filename"
  />
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import SharingData from './interfaces/sharing-data.interface';

import MSocialSharing from 'theme/components/molecules/m-social-sharing.vue';

export default Blok.extend({
  name: 'StoryblokSharing',
  components: {
    MSocialSharing
  },
  computed: {
    itemData (): SharingData {
      return this.item as SharingData;
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.storyblok-sharing {
  @include display-property-handling;
}
</style>
