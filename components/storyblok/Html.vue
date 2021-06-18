<template>
  <div
    class="storyblok-html-renderer"
    :class="cssClasses"
    :style="styles"
  >
    <div
      class="_html-wrapper"
      v-html="itemData.html"
    />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import HtmlData from './interfaces/html-data.interface';

export default Blok.extend({
  name: 'HtmlRenderer',
  computed: {
    itemData (): HtmlData {
      return this.item as HtmlData;
    }
  }
})
</script>

<style lang="scss" scoped>
.storyblok-html-renderer {
}
</style>
