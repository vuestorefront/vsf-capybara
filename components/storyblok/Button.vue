<template>
  <div class="storyblok-button">
    <sb-router-link
      :link="item.link"
      :is-new-window="item.open_in_new_window"
      class="_link button-outline brdr-none px10 py20 bg-cl-mine-shaft :bg-cl-th-secondary weight-400 cl-white fs-medium no-underline pointer align-center"
    >
      {{ item.text }}
    </sb-router-link>
  </div>
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'ButtonBlok',
  extends: Blok
}
</script>

<style scoped>
.storyblok-button ._link {
  display: inline-block;
}
</style>
