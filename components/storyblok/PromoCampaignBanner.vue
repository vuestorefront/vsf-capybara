<template>
  <div
    v-if="shouldShowImageBanner"
    :data-campaign-id="itemData.campaign_id"
    class="promotion-platform-image-banner-container"
    :class="cssClasses"
    :style="styles"
    v-html="campaignContent"
  />
</template>

<script lang="ts">
import CampaignContent from 'src/modules/promotion-platform/types/CampaignContent.model';
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import PromoCampaignBannerData from './interfaces/promo-campaign-banner-data.interface';

export default Blok.extend({
  name: 'StoryblokPromoCampaignBannerRenderer',
  computed: {
    itemData (): PromoCampaignBannerData {
      return this.item as PromoCampaignBannerData;
    },
    campaignContent (): CampaignContent | undefined {
      return this.$store.getters['promotionPlatform/campaignContent'];
    },
    promoCampaignId (): string | undefined {
      if (!this.campaignContent || !this.campaignContent.imageBanner) {
        return;
      }

      return this.campaignContent.imageBanner.campaignId;
    },
    imageBannerContent (): string | undefined {
      if (!this.campaignContent || !this.campaignContent.imageBanner) {
        return;
      }

      return this.campaignContent.imageBanner.content;
    },
    shouldShowImageBanner (): boolean {
      if (!this.imageBannerContent) {
        return false;
      }

      if (this.itemData.campaign_id && this.promoCampaignId && this.itemData.campaign_id !== this.promoCampaignId) {
        return false;
      }

      return true;
    }
  }
})
</script>
