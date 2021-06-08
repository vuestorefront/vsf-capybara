<template>
  <sb-img
    :src="item.image.filename"
    :name="item.image.name ? item.image.name : ''"
    :height="item.height ? +item.height : 0"
    :width="item.width ? +item.width : 0"
  />
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'ImageBlok',
  extends: Blok
}
</script>
