<template>
  <MZoomGallery
    :images="slides"
    :horizontal-thumbnails="isHorizontalThumbnails"
  />
</template>

<script lang="ts">
import MZoomGallery from 'theme/components/molecules/m-zoom-gallery';
import { Blok } from 'src/modules/vsf-storyblok-module/components'

import ZoomGalleryImage from 'theme/interfaces/zoom-gallery-image.interface';

export default Blok.extend({
  name: 'Slider',
  components: {
    MZoomGallery
  },
  computed: {
    slides (): ZoomGalleryImage[] {
      const slides = [];
      this.item.slider_items.forEach(sliderItem => {
        const slide: ZoomGalleryImage = {
          thumb: sliderItem.image.filename,
          stage: sliderItem.image.filename,
          big: sliderItem.image.filename,
          alt: sliderItem.alt_tag,
          title: sliderItem.title_tag,
          link: sliderItem.link_url,
          target: sliderItem.target_blank ? '_blank' : '_self'
        };

        slides.push(slide);
      });

      return slides;
    },
    isHorizontalThumbnails (): boolean {
      return this.item.thumbnails_position === 'horizontal';
    }
  }
})
</script>
