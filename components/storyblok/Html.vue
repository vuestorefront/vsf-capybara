<template>
  <div
    v-html="item.html"
    class="html-renderer"
    :class="cssClasses"
    :style="styles"
  />
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  name: 'HtmlRenderer'
})
</script>

<style lang="scss" scoped>
.html-rendering {
}
</style>
