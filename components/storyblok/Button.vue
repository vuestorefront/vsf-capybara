<template>
  <SfButton
    :link="item.link"
    :target="isOpenInNewWindow"
    class="sf-button color-primary"
  >
    {{ item.text }}
  </SfButton>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'
import { SfButton } from '@storefront-ui/vue';

export default Blok.extend({
  components: {
    SfButton,
    computed: {
      isOpenInNewWindow () {
        if (!this.item.open_in_new_window) {
          return "_self"
        }
        return "_blank"
      }
    }
  }
})

</script>

<style scoped>
.sf-button {
  display: inline-block;
  align: center;
}
</style>
