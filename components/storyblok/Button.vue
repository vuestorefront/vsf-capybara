<template>
  <div :style="styles">
    <SfButton
      :link="item.link_ur"
      :target="isOpenInNewWindow"
      :class="cssClasses"
    >
      {{ item.link_text }}
    </SfButton>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import { SfButton } from '@storefront-ui/vue';

export default Blok.extend({
  name: 'Button',
  components: {
    SfButton
  },
  computed: {
    isOpenInNewWindow (): string {
      if (!this.item.target_blank) {
        return '_self';
      }
      return '_blank';
    }
  }
})

</script>

<style scoped>
.sf-button {
  display: inline-block;
}
</style>
