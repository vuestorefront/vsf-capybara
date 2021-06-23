<template>
  <div
    class="m-zoom-gallery"
    :class="{ '-horizontal': isHorizontalThumbnails }"
  >
    <div
      class="_thumbnails"
    >
      <VueSlickCarousel
        :arrows="false"
        :vertical="!isHorizontalThumbnails"
        :slides-to-show="5"
        :slides-to-scroll="1"
        :focus-on-select="true"
        v-if="shouldShowThumbnails"
      >
        <div
          v-for="(image, index) in images"
          :key="JSON.stringify(image.thumb)"
          class="_thumbnail-item"
          @click="setCurrentIndex(index)"
        >
          <div class="_thumbnail-item-content-wrapper">
            <BaseImage
              class="_image"
              :src="getImageSrc(image, 'thumb')"
              :srcsets="getImageSrcSets(image, 'thumb')"
              :alt="image.alt"
              :title="image.title"
            />
          </div>
        </div>
      </VueSlickCarousel>
    </div>

    <div class="_stage">
      <div class="_stage-content">
        <div
          ref="stageImageWrapper"
          class="_image-wrapper cloud-zoom"
          :href="stageImage.big"
          v-if="stageImage"
        >
          <BaseImage
            class="_image"
            :src="getImageSrc(stageImage, 'stage')"
            :srcsets="getImageSrcSets(stageImage, 'stage')"
            :alt="stageImage.alt"
            :title="stageImage.title"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import {
  mapMobileObserver,
  unMapMobileObserver
} from '@storefront-ui/vue/src/utilities/mobile-observer';
import VueSlickCarousel from 'vue-slick-carousel';
import jQuery from 'jquery';
import 'vue-slick-carousel/dist/vue-slick-carousel.css';
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css';

import { BaseImage, ImageSourceItem } from 'src/modules/budsies';
import ZoomGalleryImage from 'theme/interfaces/zoom-gallery-image.interface';

require('@cabbiepete/cloud-zoom');
require('@cabbiepete/cloud-zoom/cloud-zoom.css');

type ImageKeys = keyof ZoomGalleryImage;

export default Vue.extend({
  name: 'MZoomGallery',
  components: {
    BaseImage,
    VueSlickCarousel
  },
  props: {
    images: {
      type: Array as PropType<ZoomGalleryImage[]>,
      default: () => []
    },
    horizontalThumbnails: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fCurrentIndex: undefined as number | undefined,
      fShouldShowThumbnails: false
    }
  },
  computed: {
    ...mapMobileObserver(),
    isHorizontalThumbnails (): boolean {
      if (this.horizontalThumbnails) {
        return true;
      }

      return false;
    },
    stageImage (): ZoomGalleryImage | undefined {
      if (this.currentIndex == null) {
        return undefined;
      }

      return this.images[this.currentIndex];
    },
    currentIndex: {
      get: function (): number | undefined {
        return this.fCurrentIndex;
      },
      set: function (index: number | undefined) {
        this.detachZoom();

        this.fCurrentIndex = index;

        if (index == null) {
          return;
        }

        if (this.isMobile) {
          return;
        }

        this.$nextTick(() => {
          const imageWrapper = this.getStageImageWrapper();

          if (!imageWrapper) {
            return;
          }

          jQuery(imageWrapper).CloudZoom({ adjustX: 10, showTitle: false });
        });
      }
    },
    shouldShowThumbnails: function (): boolean {
      return this.fShouldShowThumbnails
    }
  },
  created () {
    this.currentIndex = undefined;

    if (this.images.length > 0) {
      this.currentIndex = 0;
    }
  },
  beforeDestroy () {
    unMapMobileObserver();
  },
  destroyed () {
    this.detachZoom();
  },
  methods: {
    getImageSrc (image: ZoomGalleryImage, variant: ImageKeys): string | undefined {
      const value = image[variant];
      if (typeof value !== 'string') {
        return undefined;
      }

      return value;
    },
    getImageSrcSets (image: ZoomGalleryImage, variant: ImageKeys): ImageSourceItem[] | undefined {
      const value = image[variant];
      if (!Array.isArray(value)) {
        return undefined;
      }

      return value;
    },
    setCurrentIndex (index: number): void {
      const previousIndex = this.currentIndex;
      this.currentIndex = index;

      if (previousIndex !== this.currentIndex) {
        this.$emit('gallery-index-changed', this.currentIndex);
      }
    },
    detachZoom (): void {
      const imageWrapper = this.getStageImageWrapper();

      if (!imageWrapper) {
        return;
      }

      const zoom = jQuery(imageWrapper).data('zoom');

      if (!zoom) {
        return;
      }

      zoom.destroy();
    },
    getStageImageWrapper (): HTMLElement | undefined {
      return this.$refs['stageImageWrapper'] as HTMLElement | undefined;
    }
  },
  watch: {
    images: {
      handler (prev: ZoomGalleryImage[], next: ZoomGalleryImage[]) {
        if (JSON.stringify(prev) === JSON.stringify(next)) {
          return;
        };

        this.fShouldShowThumbnails = false;

        this.currentIndex = undefined;

        if (this.images.length) {
          this.currentIndex = 0;

          this.$nextTick(() => {
            this.fShouldShowThumbnails = true;
          })
        }
      },
      immediate: true
    }
  }
})
</script>

<style lang="scss" scoped>
.m-zoom-gallery {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    ._thumbnails {
        width: 15.5%;

        ._thumbnail-item {
            display: block !important;
            position: relative;
            cursor: pointer;
            padding-top: 108.1%;

            &:first-child {
                margin-top: 0;
            }
        }

        ._thumbnail-item-content-wrapper {
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 100%;
        }

        ::v-deep .slick-list {
            .slick-track {
                height: auto !important;
            }

            .slick-slide {
              border: none;
            }
        }
    }

    ._stage {
        padding-top: 83%;
        position: relative;
        width: 83%;

        ._stage-content {
            height: 100%;
            left: 0;
            position: absolute;
            top: 0;
            width: 100%;
        }

        ._image-wrapper {
          display: block;
            height: 100%;
            width: 100%;

            ._image {
                width: 100%;
                height: 100%;
            }
        }

        ::v-deep #wrap,
        ::v-deep .cloud-zoom-wrap {
            height: 100%;
            position: static;
            z-index: 100;

            .mousetrap {
                z-index: 100 !important;
            }

            .cloud-zoom-big {
                z-index: 150 !important;
            }
        }
    }

    &.-horizontal {
        flex-direction: column-reverse;

        ._thumbnails {
            margin-top: 0.5em;
            width: 100%;

            ::v-deep .slick-track {
                display: flex;
                justify-content: center;

                .slick-slide {
                    margin: 0 0.15em;
                }
            }
        }

        ._stage {
            padding-top: 99%;
            width: 100%;
        }
    }
}
</style>
