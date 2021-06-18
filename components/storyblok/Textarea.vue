<template>
  <div
    class="storyblok-textarea"
    :class="cssClasses"
    :style="styles"
  >
    <sb-rich-text v-if="itemData.content" :text="itemData.content" />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import TextareaData from './interfaces/textarea-data.interface';

export default Blok.extend({
  name: 'Textarea',
  computed: {
    itemData (): TextareaData {
      return this.item as TextareaData;
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
