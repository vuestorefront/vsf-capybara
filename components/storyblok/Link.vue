<template>
  <div>
    <router-link :id="item.id" :to="url">
      {{ item.text }}
    </router-link>
  </div>
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'LinkBlok',
  extends: Blok,
  computed: {
    url: function () {
      const { link } = this.item
      return link.cached_url || link.url
    }
  }
}
</script>
