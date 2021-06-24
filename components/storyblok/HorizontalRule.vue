<template>
  <hr
    class="storyblok-hr"
    :class="cssClasses"
    :style="styles"
  >
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import HorizontalRuleData from './interfaces/horizontal-rule-data.interface';

export default Blok.extend({
  name: 'HorizontalRule',
  computed: {
    itemData (): HorizontalRuleData {
      return this.item as HorizontalRuleData;
    },
    extraStyles (): Record<string, string> {
      const styles: Record<string, string> = {};

      if (this.itemData.color.color) {
        styles['border-color'] = this.itemData.color.color;
      }

      if (this.itemData.hr_height) {
        styles['border-width'] = this.itemData.hr_height + 'px';
      }

      if (this.itemData.hr_width) {
        styles['width'] = this.itemData.hr_width;
      }

      return styles;
    }
  }
})
</script>

<style lang="scss" scoped>
.storyblok-hr {
  margin:15px auto;
  max-width:100%;
  width:100%;
  border-width:1px;
  border:none;
  border-top:solid;
}
</style>
