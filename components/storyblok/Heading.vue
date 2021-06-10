<template>
  <SfHeading
    :level="item.heading_type"
    :title="item.title"
    subtitle=""
  />
</template>

<script lang="ts">
import { SfHeading } from '@storefront-ui/vue';
import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  components: {
    SfHeading
  }
})
</script>

<style lang="scss" scoped>
.sf-heading {
}
</style>
