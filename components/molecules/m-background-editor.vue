<template>
  <div class="m-background-editor" :class="{ '-disabled': disabled }">
    <div class="_helper-text desktop-only">
      Use the slider below (or mouse scroll) to resize your image. Then,
      click and drag your photo to move the image.
    </div>

    <div class="_helper-text _accent-header mobile-only">
      Use the slider (or pinch) to resize your image. Then, tap and drag
      your photo to move the image to the desired position.
    </div>

    <div class="_croppie-stage">
      <div class="_croppie-wrapper">
        <SfIcon
          class="_zoom-button"
          icon="chevron_up"
          size="xxs"
          :style="getZoomInButtonStyles()"
          @click="zoomIn"
        />
        <SfIcon
          class="_zoom-button"
          icon="chevron_down"
          size="xxs"
          :style="getZoomOutButtonStyles()"
          @click="zoomOut"
        />
        <div
          class="vue-croppie-container"
          :style="getVueCroppieContainerStyles()"
        >
          <vue-croppie-component
            v-if="!isServer"
            ref="croppieRef"
            :boundary="{
              width: 'calc(100% - 2px)',
              height: 'calc(100% - 58px)',
            }"
            :viewport="{
              width: '100%',
              height: '100%',
              type: 'square',
            }"
            :enable-resize="false"
            :enforce-boundary="true"
          />
        </div>

        <div
          class="_preview-container"
          :style="getPreviewContainerStyle()"
        >
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'croppie/croppie.css';

import Vue, { VueConstructor } from 'vue';
import { VueCroppieComponent } from 'vue-croppie';
import EXIF from 'exif-js';
import throttle from 'lodash.throttle';
import { SfIcon } from '@storefront-ui/vue';

import BackgroundOffsetSettings from '../interfaces/background-offset-settings.interface';
import { InjectKey, PropType } from 'vue/types/options';
import { isServer } from '@vue-storefront/core/helpers'

interface InjectedServices {
  fWindow: Window
}

type InjectType<T> = Record<keyof T, InjectKey | { from?: InjectKey, default?: any }>;

const DEFAULT_CROPPIE_EDGE_SIZE = 100;
const DEFAULT_CROPPIE_OFFSET_SIZE = 0;

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'MBackgroundEditor',
  inject: {
    fWindow: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  components: { VueCroppieComponent, SfIcon },
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    backgroundOffsetSettings: {
      type: Object as PropType<BackgroundOffsetSettings | undefined>,
      default: undefined
    }
  },
  computed: {
    isServer () {
      return isServer;
    }
  },
  data () {
    return {
      fBackgroundImageUrl: undefined as string | undefined,
      fIsImageAssigned: false,
      fPreviousWidth: undefined as number | undefined,
      fCroppieWidth: DEFAULT_CROPPIE_EDGE_SIZE,
      fCroppieHeight: DEFAULT_CROPPIE_EDGE_SIZE,
      fCroppieBoundaryOffsetSize: DEFAULT_CROPPIE_OFFSET_SIZE,
      fCroppieBoundaryOffsetPosition: ''
    }
  },
  methods: {
    getPreviewContainerStyle (): string {
      return this.fIsImageAssigned ? '' : 'background-color: #fff';
    },
    async setBackgroundImage (imageUrl: string): Promise<void> {
      this.fBackgroundImageUrl = imageUrl;

      const croppie = this.getCroppieContainer();
      if (!croppie) {
        throw Error('Croppie is not initialized yet!');
      }

      await croppie.bind({
        url: imageUrl,
        zoom: 0.5
      });

      this.fPreviousWidth = this.fWindow.innerWidth;

      this.fIsImageAssigned = true;
    },
    getCroppedBackground (): Promise<string | undefined> {
      const croppie = this.getCroppieContainer();
      if (!croppie || !this.fIsImageAssigned) {
        return Promise.resolve(undefined);
      }

      const options = {
        type: 'base64',
        size: 'original',
        format: 'jpeg',
        quality: 0.95
      };

      return croppie.result(options);
    },
    zoomIn (): void {
      this.zoom(1.1);
    },
    zoomOut (): void {
      this.zoom(0.9);
    },
    getVueCroppieContainerStyles () {
      let styles =
            'width: ' +
            this.fCroppieWidth.toString() +
            '%; height: ' +
            this.fCroppieHeight.toString() +
            '%;';

      if (
        !this.fCroppieBoundaryOffsetSize ||
            !this.fCroppieBoundaryOffsetPosition
      ) {
        return styles;
      }

      if (this.fCroppieBoundaryOffsetPosition !== 'left') {
        return styles;
      }

      styles += 'margin-left: ' + this.fCroppieBoundaryOffsetSize.toString() + '%;';

      return styles;
    },
    getZoomSectionContainer (): HTMLElement | undefined {
      const croppie = this.getCroppieContainer();

      if (!croppie) {
        throw Error('Croppie is not initialized yet!');
      }

      return croppie.$el.getElementsByClassName('cr-slider-wrap').item(0) as
            | HTMLElement
            | undefined;
    },
    getZoomOutButtonStyles () {
      let styles = 'left: 0;';

      if (
        this.fCroppieBoundaryOffsetSize &&
            this.fCroppieBoundaryOffsetPosition === 'left'
      ) {
        styles =
                'left: ' + this.fCroppieBoundaryOffsetSize.toString() + '%;';
      }
      return styles;
    },
    getZoomInButtonStyles () {
      let styles = 'right: 0;';

      if (
        this.fCroppieBoundaryOffsetSize &&
            this.fCroppieBoundaryOffsetPosition === 'right'
      ) {
        const offsetSize = this.fCroppieBoundaryOffsetSize - 3;
        styles += 'right: ' + offsetSize.toString() + '%;';
      }
      return styles;
    },
    getCroppieContainer (): VueCroppieComponent | undefined {
      return this.$refs['croppieRef'] as VueCroppieComponent | undefined;
    },
    zoom (factor: number): void {
      const croppie = this.getCroppieContainer();

      if (!croppie) {
        throw Error('Croppie is not initialized yet!');
      }

      const currentZoom = croppie.get().zoom;

      croppie.setZoom(currentZoom * factor);
    },
    prepareCroppieDimensions (settings: BackgroundOffsetSettings) {
      this.fCroppieWidth = DEFAULT_CROPPIE_EDGE_SIZE;
      this.fCroppieHeight = DEFAULT_CROPPIE_EDGE_SIZE;
      this.fCroppieBoundaryOffsetSize = DEFAULT_CROPPIE_OFFSET_SIZE;
      this.fCroppieBoundaryOffsetPosition = '';

      if (!settings.size || !settings.position) {
        return;
      }

      if (settings.position === 'left' || settings.position === 'right') {
        this.fCroppieWidth = 100 - parseFloat(settings.size);
      } else {
        this.fCroppieHeight = 100 - parseFloat(settings.size);
      }

      this.fCroppieBoundaryOffsetPosition = settings.position;
      this.fCroppieBoundaryOffsetSize = parseFloat(settings.size);
    },
    updateZoomSectionStyles (): void {
      if (!this.fCroppieBoundaryOffsetSize) {
        return;
      }

      const zoomSection = this.getZoomSectionContainer();

      if (!zoomSection) {
        return;
      }

      zoomSection.style.marginBottom = '';

      if (
        !this.fCroppieBoundaryOffsetPosition ||
        this.fCroppieBoundaryOffsetPosition !== 'top'
      ) {
        return;
      }

      zoomSection.style.marginBottom = this.fCroppieBoundaryOffsetSize.toString() + '%';
    },
    reassignBackgroundImage () {
      if (this.fBackgroundImageUrl === undefined) {
        return;
      }

      // On mobile phones nav bar toggle changes the size of the viewport,
      // which leads to unwanted zoom/position reset.
      // We are interested in width changes only
      if (this.fWindow.innerWidth === this.fPreviousWidth) {
        return;
      }

      void this.setBackgroundImage(this.fBackgroundImageUrl);
    },
    fResizeHandler: function () {
      throttle(
        () => this.reassignBackgroundImage(),
        300
      );
    }
  },
  created (): void {
    if (isServer) {
      return;
    }

    if (!(this.fWindow as any).EXIF) {
      (this.fWindow as any).EXIF = EXIF;
    }
  },
  mounted (): void {
    if (isServer) {
      return;
    }

    this.fWindow.addEventListener('resize', this.fResizeHandler);
  },
  beforeDestroy (): void {
    if (isServer) {
      return;
    }

    this.fWindow.removeEventListener('resize', this.fResizeHandler);
  },
  watch: {
    backgroundOffsetSettings: {
      handler () {
        if (!this.backgroundOffsetSettings) {
          return;
        }

        this.prepareCroppieDimensions(this.backgroundOffsetSettings);

        this.updateZoomSectionStyles();

        if (this.fBackgroundImageUrl === undefined) {
          return;
        }

        void this.setBackgroundImage(this.fBackgroundImageUrl);
      },
      immediate: true
    }
  }
})
</script>

<style lang="scss" scoped>
.m-background-editor {
    position: relative;

    ._helper-text {
        font-size: var(--font-xs);
        font-weight: var(--font-medium);
    }

    ._croppie-stage {
        margin-top: 1em;
        position: relative;
        padding-top: calc(100% + 56px);

        ._croppie-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
        }

        .croppie-container {
            display: flex;
            flex-flow: column;

            ::v-deep .cr-slider-wrap {
                order: 1;
                height: 26px;

                .cr-slider {
                    height: 19px;
                    max-width: 95%;
                }
            }

            ::v-deep .cr-boundary {
                margin-left: 1px;
                order: 2;

                .cr-viewport {
                    border: none;
                }
            }
        }

        ._zoom-button {
            background-size: cover;
            box-sizing: content-box;
            cursor: pointer;
            font-size: 24px;
            height: 24px;
            line-height: 1;
            padding: 16px 6px;
            position: absolute;
            width: 24px;
        }
    }

    ._preview-container {
        height: calc(100% - 56px);
        left: 0;
        pointer-events: none;
        position: absolute;
        top: 55px;
        width: 100%;
        z-index: 10;
    }

    &.-disabled {
        ._croppie-stage {
            pointer-events: none;
        }
    }
}
</style>
