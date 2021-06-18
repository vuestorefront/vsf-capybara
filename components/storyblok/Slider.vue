<template>
  <MZoomGallery
    :images="slides"
    :horizontal-thumbnails="isHorizontalThumbnails"
  />
</template>

<script lang="ts">
import MZoomGallery from 'theme/components/molecules/m-zoom-gallery.vue';
import ZoomGalleryImage from 'theme/interfaces/zoom-gallery-image.interface';

import { Blok } from 'src/modules/vsf-storyblok-module/components'
import SliderData from './interfaces/slider-data.interface';
import { ThumbnailsPosition } from './interfaces/thumbnails-position.value';

export default Blok.extend({
  name: 'Slider',
  components: {
    MZoomGallery
  },
  computed: {
    itemData (): SliderData {
      return this.item as SliderData;
    },
    slides (): ZoomGalleryImage[] {
      const slides = [];
      for (const sliderItem of this.itemData.slider_items) {
        const slide: ZoomGalleryImage = {
          thumb: sliderItem.image.filename,
          stage: sliderItem.image.filename,
          big: sliderItem.image.filename,
          alt: sliderItem.alt_tag,
          title: sliderItem.title_tag,
          link: sliderItem.link_url.url,
          target: sliderItem.target_blank ? '_blank' : '_self'
        };

        slides.push(slide);
      }

      return slides;
    },
    isHorizontalThumbnails (): boolean {
      return this.itemData.thumbnails_position === ThumbnailsPosition.HORIZONTAL;
    }
  }
})
</script>
