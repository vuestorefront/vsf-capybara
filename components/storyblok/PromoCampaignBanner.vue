<template>
  <div
    :data-campaign-id="itemData.campaign_id"
    class="promotion-platform-image-banner-container"
    :class="cssClasses"
    :style="styles"
  />
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import PromoCampaignBannerData from './interfaces/promo-campaign-banner-data.interface';

export default Blok.extend({
  name: 'StoryblokPromoCampaignBannerRenderer',
  computed: {
    itemData (): PromoCampaignBannerData {
      return this.item as PromoCampaignBannerData;
    }
  }
})
</script>
