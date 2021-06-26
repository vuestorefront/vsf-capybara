<template>
  <div
    class="sharing-buttons"
    :class="cssClasses"
    :style="styles"
  >
    <a class="sharing-button -email" :href="shareEmailHref" target="_blank" />
    <a class="sharing-button -pinterest" :href="sharePinterestHref" target="_blank" />
    <a class="sharing-button -twitter" :href="shareTwitterHref" target="_blank" />
    <a class="sharing-button -facebook" :href="shareFacebookHref" target="_blank" />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import SharingData from './interfaces/sharing-data.interface';

export default Blok.extend({
  name: 'StoryblokSharing',
  computed: {
    itemData (): SharingData {
      return this.item as SharingData;
    },
    shareEmailHref (): string {
      const lineBreak = encodeURIComponent('\r\n');
      const emailText = this.itemData.sharing_description + lineBreak + lineBreak + 'Link:' + lineBreak + this.itemData.sharing_url.url;
      return `mailto:?subject=${this.itemData.sharing_email_subject}&body=${emailText}`;
    },
    sharePinterestHref (): string {
      return `http://pinterest.com/pin/create/button/?media=${this.itemData.sharing_image.filename}` +
      `&description=${this.itemData.sharing_description}&url=${this.itemData.sharing_url.url}`;
    },
    shareTwitterHref (): string {
      return `http://twitter.com/share?text=${this.itemData.twitter_description}&url=${this.itemData.sharing_url.url}`;
    },
    shareFacebookHref (): string {
      return `http://www.facebook.com/sharer.php?u=${this.itemData.sharing_url.url}`;
    }
  }
})
</script>

<style lang="scss" scoped>
.sharing-buttons {

  .sharing-button {
    background: url('/assets/sharing.png') no-repeat;
    background-position: 0;
    display: inline-block;
    height: 30px;
    width: 30px;

    &.-pinterest {
      background-position: -30px 0;

      &:hover {
        background-position: -30px -30px;
      }
    }

    &.-twitter {
      background-position: -60px 0;

      &:hover {
        background-position: -60px -30px;
      }
    }

    &.-facebook {
      background-position: -90px 0;

      &:hover {
        background-position: -90px -30px;
      }
    }

    &.-email {
      background-position: 0 0;

      &:hover {
        background-position: 0 -30px;
      }
    }
  }
}
</style>
