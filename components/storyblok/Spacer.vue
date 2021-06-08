<template>
  <div class="spacer" />
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'SpacerBlok',
  extends: Blok
}
</script>

<style lang="scss" scoped>
.spacer {
  width: 100%;
  border-bottom: 1px solid black;
  margin: 10px 0;
}
</style>
