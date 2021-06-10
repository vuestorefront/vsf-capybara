<template>
  <div
    v-html="item.html"
    class="html-renderer"
    :class="item.css_classes"
    :style="styles"
  />
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  name: 'HtmlRenderer',
  computed: {
    styles (): string {
      let styles = '';
      if (this.item.alignment) {
        styles += 'text-align: ' + this.item.alignment.toString();
      }
      return styles;
    }
  }
})
</script>

<style lang="scss" scoped>
.html-rendering {
}
</style>
