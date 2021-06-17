<template>
  <div v-if="ratingEnabled" :class="cssClasses" class="website-rating-container" :style="styles">
    <div class="external-script" />
    <!-- <script type="application/ld+json">{{ ratingDataSring }}</script> -->
    <div class="website-rating" :data-average-rating="averageValue">
      <div class="_rating">
        Rating: {{ averageValue }} / 5
      </div>

      <div class="_rating-stars" />

      <div class="_reviewsCount">
        based on {{ reviewsCount }} Google reviews
      </div>

      <div class="_links">
        <a :href="reviewsLink"
           target="_blank"
        >
          {{ reviewsLinkText }}
        </a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';

export default Blok.extend({
  name: 'WebsiteRating',
  data () {
    return {
      ratingEnabled: true
    }
  },
  computed: {
    ratingEnabled (): boolean {
    // value should be fetched from Magento config
      return true;
    },
    averageValue (): number {
    // value should be fetched from Magento config
      return 4.8;
    },
    reviewsCount (): number {
    // value should be fetched from Magento config
      return 149;
    },
    reviewsLink (): string {
      if (!this.item.link_url) {
        return 'reviews';
      }
      return this.item.link_url;
    },
    reviewsLinkText (): string {
      if (!this.item.link_text) {
        return 'Go to all reviews';
      }
      return this.item.link_text;
    },
    ratingDataString (): string {
      return '';
    }
  }
})
</script>
