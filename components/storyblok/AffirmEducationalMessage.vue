<template>
  <div
    class="storyblok-affirm-educational-message"
    :class="cssClasses"
    :style="styles"
  >
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import AffirmEducationalMessageData from './interfaces/affirm-educational-message-data.interface';

export default Blok.extend({
  name: 'StoryblokAffirmEducationalMessage',
  computed: {
    itemData (): AffirmEducationalMessageData {
      return this.item as AffirmEducationalMessageData;
    },
  }
})
</script>

<style lang="scss" scoped>

</style>
