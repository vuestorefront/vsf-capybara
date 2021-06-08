<template>
  <div>
    <sb-rich-text v-if="item.content" :text="item.content" />
  </div>
</template>

<script>
import { Blok } from 'src/modules/vsf-storyblok-module/components'
export default {
  name: 'Textarea',
  extends: Blok,
  computed: {
    itemValue () {
      return this.item;
    }
  }
}
</script>
