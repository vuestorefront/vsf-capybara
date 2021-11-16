<template>
  <div class="m-background-editor" :class="{ '-disabled': disabled }">
    <div class="_croppie-stage">
      <div class="_croppie-wrapper">
        <SfIcon
          class="_zoom-button _zoom-in"
          icon="minus"
          size="xxs"
          @click="zoomIn"
        >
          <template>
            <div class="_icon-inner" />
          </template>
        </SfIcon>

        <SfIcon
          class="_zoom-button _zoom-out"
          size="xxs"
          @click="zoomOut"
        >
          <template>
            <div class="_icon-inner" />
          </template>
        </SfIcon>

        <div
          class="vue-croppie-container"
          :style="getVueCroppieContainerStyles()"
        >
          <NoSSR>
            <vue-croppie-component
              ref="croppieRef"
              :boundary="{
                width: 'calc(100% - 2px)',
                height: 'calc(100% - 2px)',
              }"
              :viewport="{
                width: '100%',
                height: '100%',
                type: 'square',
              }"
              :enable-resize="false"
              :enforce-boundary="true"
            />
          </NoSSR>
        </div>

        <div class="_preview-container" :style="getPreviewContainerStyle()">
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'croppie/croppie.css';

import NoSSR from 'vue-no-ssr';
import Vue, { VueConstructor } from 'vue';
import { VueCroppieComponent } from 'vue-croppie';
import EXIF from 'exif-js';
import throttle from 'lodash.throttle';
import { SfIcon } from '@storefront-ui/vue';

import BackgroundOffsetSettings from '../interfaces/background-offset-settings.interface';
import { PropType } from 'vue/types/options';
import { isServer } from '@vue-storefront/core/helpers';

import { InjectType } from 'src/modules/shared';

interface InjectedServices {
  window: Window
}

const DEFAULT_CROPPIE_EDGE_SIZE = 100;
const DEFAULT_CROPPIE_OFFSET_SIZE = 0;

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'MBackgroundEditor',
  components: { VueCroppieComponent, SfIcon, NoSSR },
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
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
  data () {
    return {
      backgroundImageUrl: undefined as string | undefined,
      isImageAssigned: false,
      previousWidth: undefined as number | undefined,
      croppieWidth: DEFAULT_CROPPIE_EDGE_SIZE,
      croppieHeight: DEFAULT_CROPPIE_EDGE_SIZE,
      croppieBoundaryOffsetSize: DEFAULT_CROPPIE_OFFSET_SIZE,
      croppieBoundaryOffsetPosition: '',
      resizeHandler: undefined as (() => void) | undefined
    };
  },
  methods: {
    getCroppedBackground (): Promise<string | undefined> {
      const croppie = this.getCroppieContainer();
      if (!croppie || !this.isImageAssigned) {
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
    getPreviewContainerStyle (): string {
      return this.isImageAssigned ? '' : 'background-color: #fff';
    },
    getVueCroppieContainerStyles () {
      let styles =
        'width: ' +
        this.croppieWidth.toString() +
        '%; height: ' +
        this.croppieHeight.toString() +
        '%;';

      if (
        !this.croppieBoundaryOffsetSize ||
        !this.croppieBoundaryOffsetPosition
      ) {
        return styles;
      }

      if (this.croppieBoundaryOffsetPosition !== 'left') {
        return styles;
      }

      styles +=
        'margin-left: ' + this.croppieBoundaryOffsetSize.toString() + '%;';

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
    getCroppieContainer (): VueCroppieComponent | undefined {
      return this.$refs['croppieRef'] as VueCroppieComponent | undefined;
    },
    zoomIn (): void {
      this.zoom(1.1);
    },
    zoomOut (): void {
      this.zoom(0.9);
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
      this.croppieWidth = DEFAULT_CROPPIE_EDGE_SIZE;
      this.croppieHeight = DEFAULT_CROPPIE_EDGE_SIZE;
      this.croppieBoundaryOffsetSize = DEFAULT_CROPPIE_OFFSET_SIZE;
      this.croppieBoundaryOffsetPosition = '';

      if (!settings.size || !settings.position) {
        return;
      }

      if (settings.position === 'left' || settings.position === 'right') {
        this.croppieWidth = 100 - parseFloat(settings.size);
      } else {
        this.croppieHeight = 100 - parseFloat(settings.size);
      }

      this.croppieBoundaryOffsetPosition = settings.position;
      this.croppieBoundaryOffsetSize = parseFloat(settings.size);
    },
    updateZoomSectionStyles (): void {
      if (!this.croppieBoundaryOffsetSize) {
        return;
      }

      const zoomSection = this.getZoomSectionContainer();

      if (!zoomSection) {
        return;
      }

      zoomSection.style.marginBottom = '';

      if (
        !this.croppieBoundaryOffsetPosition ||
        this.croppieBoundaryOffsetPosition !== 'top'
      ) {
        return;
      }

      zoomSection.style.marginBottom =
        this.croppieBoundaryOffsetSize.toString() + '%';
    },
    reassignBackgroundImage () {
      if (this.backgroundImageUrl === undefined) {
        return;
      }

      // On mobile phones nav bar toggle changes the size of the viewport,
      // which leads to unwanted zoom/position reset.
      // We are interested in width changes only
      if (this.window.innerWidth === this.previousWidth) {
        return;
      }

      void this.setBackgroundImage(this.backgroundImageUrl);
    },
    async setBackgroundImage (imageUrl: string): Promise<void> {
      this.backgroundImageUrl = imageUrl;

      const croppie = this.getCroppieContainer();
      if (!croppie) {
        throw Error('Croppie is not initialized yet!');
      }

      await croppie.bind({
        url: imageUrl,
        zoom: 0
      });

      this.previousWidth = this.window.innerWidth;

      this.isImageAssigned = true;

      this.$emit('background-image-assigned');
    }
  },
  created (): void {
    if (isServer) {
      return;
    }

    if (!(this.window as any).EXIF) {
      (this.window as any).EXIF = EXIF;
    }
  },
  mounted (): void {
    if (isServer) {
      return;
    }

    this.resizeHandler = throttle(() => this.reassignBackgroundImage(), 300);

    this.window.addEventListener('resize', this.resizeHandler);
  },
  beforeDestroy (): void {
    if (isServer) {
      return;
    }

    if (this.resizeHandler) {
      this.window.removeEventListener('resize', this.resizeHandler);
    }
  },
  watch: {
    backgroundOffsetSettings: {
      handler () {
        if (!this.backgroundOffsetSettings) {
          return;
        }

        this.prepareCroppieDimensions(this.backgroundOffsetSettings);

        this.updateZoomSectionStyles();

        if (this.backgroundImageUrl === undefined) {
          return;
        }

        void this.setBackgroundImage(this.backgroundImageUrl);
      },
      immediate: false,
      deep: true
    }
  }
});
</script>

<style lang="scss" scoped>
.m-background-editor {
  position: relative;

  * {
    box-sizing: border-box;
  }

  .vue-croppie-container {
    position: relative;
  }

  ._helper-text {
    font-size: var(--font-xs);
    font-weight: var(--font-medium);
    margin-top: var(--spacer-sm);
  }

  ._croppie-stage {
    position: relative;
    padding-top: 100%;

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
        display: none;
        order: 1;
        height: 26px;

        .cr-slider {
          height: 19px;
          max-width: 95%;
        }
      }

      ::v-deep .cr-boundary {
        margin-left: 1px;
        margin-top: 1px;
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
      padding: 0 6px 8px;
      position: absolute;
      width: 24px;
      top: -30px;

      ._icon-inner {
        width: 100%;
        height: 100%;
      }

      &._zoom-in {
        right: 0;

        ._icon-inner {
          background: url('/assets/images/phrasePillow/zoom-in.svg');
        }
      }

      &._zoom-out {
        left: 0;

        ._icon-inner {
          background: url('/assets/images/phrasePillow/zoom-out.svg');
        }
      }
    }
  }

  ._preview-container {
    height: 100%;
    left: 0;
    pointer-events: none;
    position: absolute;
    top: 0;
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
