<template>
  <div
    :data-campaign-id="item.campaign_id"
    class="promotion-platform-image-banner-container"
    :class="cssClasses"
    :style="styles"
  />
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  name: 'PromoCampaignBannerRenderer'
})
</script>
