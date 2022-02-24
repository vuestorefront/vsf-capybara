<template>
  <div class="storyblok-buttons" :style="styles" :class="cssClasses">
    <Button
      v-for="button in buttons"
      :key="button._uid"
      class="_button-item"
      :item="button"
    />
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components'

import Button from './Button.vue';

import ButtonItemData from './interfaces/button-item-data.interface';
import ButtonsData from './interfaces/buttons-data.interface';

export default Blok.extend({
  name: 'StoryblokButtons',
  components: {
    Button
  },
  computed: {
    itemData (): ButtonsData {
      return this.item as ButtonsData;
    },
    buttons (): ButtonItemData[] {
      return this.itemData.button_items;
    }
  }
})

</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.storyblok-buttons {
  width: 100%;

  ._button-item {
    display: inline-block;
    margin-left: 1em;

    &:first-child {
      margin-left: 0;
    }
  }

  @include display-property-handling;
}
</style>
