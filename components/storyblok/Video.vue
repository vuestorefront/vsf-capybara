<template>
  <iframe
    :src="itemData.video_url"
    class="storyblok-video"
    :class="cssClasses"
    :style="styles"
  />
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import VideoData from './interfaces/video-data.interface';

export default Blok.extend({
  name: 'Video',
  computed: {
    itemData (): VideoData {
      return this.item as VideoData;
    },
    extraStyles (): Record<string, string> {
      const result: Record<string, string> = {};

      if (this.item.video_height) {
        result['height'] = this.itemData.video_height + 'px';
      }

      if (this.item.video_width) {
        result['width'] = this.itemData.video_width + 'px';
      }

      return result;
    }
  }
})
</script>

<style lang="scss" scoped>
.storyblok-video {
  float: left;
  width: 100%;
  height: 350px;
  box-sizing: border-box;
  border: 0;
}
</style>
