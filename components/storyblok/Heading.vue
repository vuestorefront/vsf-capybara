<template>
  <SfHeading
    class="storyblok-heading"
    :level="headingSize"
    :title="itemData.title"
    :class="cssClasses"
    :style="styles"
  />
</template>

<script lang="ts">
import { SfHeading } from '@storefront-ui/vue';
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import HeadingData from './interfaces/heading-data.interface';

export default Blok.extend({
  name: 'Heading',
  components: {
    SfHeading
  },
  computed: {
    itemData (): HeadingData {
      return this.item as HeadingData;
    },
    headingSize (): number {
      return Number(this.itemData.heading_type);
    }
  }
})
</script>

<style lang="scss" scoped>
.storyblok-heading {
  //
}
</style>
