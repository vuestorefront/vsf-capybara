<template>
  <SfHeading
    :level="headingSize"
    :title="item.title"
    :class="cssClasses"
    :style="styles"
  />
</template>

<script lang="ts">
import { SfHeading } from '@storefront-ui/vue';
import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  name: 'Heading',
  components: {
    SfHeading
  },
  computed: {
    headingSize (): number {
      return Number(this.item.heading_type);
    }
  }
})
</script>

<style lang="scss" scoped>
.sf-heading {
}
</style>
