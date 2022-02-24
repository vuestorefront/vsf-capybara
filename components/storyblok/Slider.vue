<template>
  <MZoomGallery
    class="storyblok-slider"
    :images="slides"
    :horizontal-thumbnails="isHorizontalThumbnails"
  />
</template>

<script lang="ts">
import { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';

import { InjectType } from 'src/modules/shared';
import { ComponentWidthCalculator, SizeValue } from 'src/modules/vsf-storyblok-module';

import MZoomGallery from 'theme/components/molecules/m-zoom-gallery.vue';
import ZoomGalleryImage from 'theme/interfaces/zoom-gallery-image.interface';

import { Blok } from 'src/modules/vsf-storyblok-module/components'
import SliderData from './interfaces/slider-data.interface';
import { ThumbnailsPosition } from './interfaces/thumbnails-position.value';
import generateBreakpointsSpecs from './generate-breakpoints-specs';
import generateImageSourcesList from './generate-image-sources-list';
import getResizedImageUrl from './get-resized-image-url';

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokSlider',
  components: {
    MZoomGallery
  },
  inject: {
    componentWidthCalculator: { }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    itemData (): SliderData {
      return this.item as SliderData;
    },
    slides (): ZoomGalleryImage[] {
      const slides = [];
      for (const sliderItem of this.itemData.slider_items) {
        if (!sliderItem.image.filename) {
          continue;
        }

        let breakpointsSpecs = generateBreakpointsSpecs(
          sliderItem.image.filename,
          this.componentWidthCalculator,
          sliderItem.mobile_image.filename
        )

        const stage = generateImageSourcesList(
          breakpointsSpecs,
          this.supportsWebp,
          1
        );

        const thumbWidthCalculator = this.componentWidthCalculator.limitAllByPercent(20);

        breakpointsSpecs = generateBreakpointsSpecs(
          sliderItem.image.filename,
          thumbWidthCalculator,
          sliderItem.mobile_image.filename
        )

        const thumb = generateImageSourcesList(
          breakpointsSpecs,
          this.supportsWebp,
          1
        );

        const brakpointsList = this.componentWidthCalculator.getBreakpoints();

        const big = getResizedImageUrl(
          sliderItem.image.filename,
          brakpointsList[SizeValue.xlarge],
          this.supportsWebp
        )

        const slide: ZoomGalleryImage = {
          thumb,
          stage,
          big,
          alt: sliderItem.alt_tag,
          title: sliderItem.title_tag
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

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.storyblok-slider {
  @include display-property-handling;
}
</style>
