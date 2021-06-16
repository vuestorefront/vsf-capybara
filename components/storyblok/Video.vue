<template>
  <iframe
    :src="item.video_url.url"
    class="sf-video"
    :class="cssClasses"
    :style="[styles, iframeStyles]"
  />
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  name: 'HtmlRenderer',
  computed: {
    iframeStyles (): Record<string, string> {
      const result: Record<string, string> = {};

      if (this.item.video_height) {
        result['height'] = this.item.video_height + 'px';
      }

      if (this.item.video_width) {
        result['width'] = this.item.video_width + 'px';
      }

      return result;
    }
  }
})
</script>

<style lang="scss" scoped>
.sf-video {
  float: left;
  width: 100%;
  height: 350px;
  box-sizing: border-box;
  border: 0;
}
</style>
