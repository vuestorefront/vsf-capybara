<template>
  <div
    class="storyblok-textarea"
    :class="cssClasses"
    :style="styles"
  >
    <sb-rich-text v-if="item.content" :text="item.content" />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'

export default Blok.extend({
  name: 'Textarea',
  computed: {
    itemValue () {
      return this.item;
    }
  }
});
</script>

<style lang="scss" scoped>
.storyblok-textarea {
  ::v-deep ul, ol, dl {
    display: inline-block;
    text-align: left;
  }
}
</style>
