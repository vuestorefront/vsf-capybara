<template>
  <div :class="cssClasses" :style="styles">
    <SfImage
      :src="imagesList"
      :alt="item.alt_tag"
      pictureBreakpoint="768"
      width=""
      height=""
    />
    <p v-if="item.show_caption">{{ item.title_tag }}</p>
  </div>
</template>

<script lang="ts">
import { Blok } from '../../../../modules/vsf-storyblok-module/components';
import { SfImage } from '@storefront-ui/vue';

export default Blok.extend({
  name: 'Image',
  components: {
    SfImage
  },
  computed: {
    imagesList (): Record<string, any> {
      let imagesSet: Record<string, any> = [];
      imagesSet['desktop'] = [];
      imagesSet['desktop']['url'] = this.item.image.filename;

      if (this.item.mobile_image.filename){
        imagesSet['mobile'] = [];
        imagesSet['mobile']['url'] = this.item.mobile_image.filename;
      }

      return imagesSet;
    }
  }
})
</script>
