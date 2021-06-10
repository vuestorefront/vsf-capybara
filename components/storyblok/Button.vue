<template>
  <SfButton
    :link="item.link_ur"
    :target="isOpenInNewWindow"
    class="sf-button color-primary"
  >
    {{ item.link_text }}
  </SfButton>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import { SfButton } from '@storefront-ui/vue';

export default Blok.extend({
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
