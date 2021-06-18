<template>
  <div class="storyblok-video" :class="cssClasses" :style="styles">
    <iframe
      class="_embed-container"
      :src="embedUrl"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      v-if="embedUrl"
    />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { AspectRatio } from './interfaces/aspect-ratio.value';
import { VideoProvider } from './interfaces/video-provider.value';
import VideoData from './interfaces/video-data.interface';

export default Blok.extend({
  name: 'Video',
  computed: {
    itemData (): VideoData {
      return this.item as VideoData;
    },
    extraStyles (): Record<string, string> {
      const result: Record<string, string> = {};

      if (!this.itemData.aspect_ratio) {
        return result;
      }

      let height = 0.0;

      switch (this.itemData.aspect_ratio) {
        case AspectRatio.A4_3:
          height = 3 / 4;
          break;
        case AspectRatio.A16_10:
          height = 10 / 16;
          break;
        case AspectRatio.A16_9:
        default:
          height = 9 / 16;
          break;
      }

      result['--storyblok-video-height'] = height * 100 + '%';

      return result;
    },
    embedUrl (): string | undefined {
      if (this.itemData.url.provider === VideoProvider.youtube) {
        return '//www.youtube.com/embed/' +
          this.itemData.url.video_id +
          '?modestbranding=1' +
          '&rel=0' +
          '&controls=' +
          (this.itemData.display_controls ? 1 : 0);
      }

      if (this.itemData.url.provider === VideoProvider.vimeo) {
        return '//player.vimeo.com/video/' + this.itemData.url.video_id
      }

      if (this.itemData.url.provider === VideoProvider.wistia) {
        return '//fast.wistia.net/embed/iframe/' + this.itemData.url.video_id
      }

      return undefined;
    }
  }
});
</script>

<style lang="scss" scoped>
.storyblok-video {
  position: relative;
  padding-top: var(--storyblok-video-height, 56.25%);

  ._embed-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
    box-sizing: border-box;
  }
}
</style>
