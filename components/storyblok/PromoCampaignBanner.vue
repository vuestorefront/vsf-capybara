<template>
  <div
    v-if="shouldShowImageBanner"
    :data-campaign-id="itemData.campaign_id"
    class="promotion-platform-image-banner-container"
    :class="cssClasses"
    :style="styles"
    v-html="imageBannerContent"
  />
</template>

<script lang="ts">
import CampaignContent from 'src/modules/promotion-platform/types/CampaignContent.model';
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import PromoCampaignBannerData from './interfaces/promo-campaign-banner-data.interface';

export default Blok.extend({
  name: 'StoryblokPromoCampaignBannerRenderer',
  data () {
    return {
      isMounted: false
    }
  },
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
      if (!this.imageBannerContent || !this.isMounted) {
        return false;
      }

      if (this.itemData.campaign_id && this.promoCampaignId && this.itemData.campaign_id != this.promoCampaignId) {
        return false;
      }

      return true;
    }
  },
  async mounted () {
    await this.$nextTick()
    this.isMounted = true;
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.promotion-platform-image-banner-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px;

  ::v-deep {
    .show-for-medium-up {
      display: none;
    }

    img {
      max-width: 100%;
    }
  }

  @media (min-width: $tablet-min) {
    ::v-deep {
      .show-for-medium-up {
        display: inherit;
      }

      .show-for-small-only {
        display: none;
      }
    }
  }

  @include display-property-handling;
}
</style>
