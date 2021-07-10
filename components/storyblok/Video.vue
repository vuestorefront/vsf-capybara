<template>
  <div class="storyblok-video" :class="cssClasses" :style="styles">
    <StreamingVideo
      class="_embedded-video"
      :aspect-ratio="itemData.aspect_ratio"
      :video-id="itemData.url.video_id"
      :provider="itemData.url.provider"
      v-if="itemData.url.video_id && itemData.url.provider"
    />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';

import { StreamingVideo } from 'src/modules/shared';

import VideoData from './interfaces/video-data.interface';

export default Blok.extend({
  name: 'StoryblokVideo',
  components: {
    StreamingVideo
  },
  computed: {
    itemData (): VideoData {
      return this.item as VideoData;
    }
  }
});
</script>

<style lang="scss" scoped>
.storyblok-video {
  &.-editor-preview-mode {
    ._embedded-video {
      pointer-events: none
    }
  }
}
</style>
