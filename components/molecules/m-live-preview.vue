<template>
  <div class="m-live-preview" :class="{ '-loading': isLoading }">
    <div ref="svgContent" class="_svg-content" v-html="previewContent" />
    <div class="_preview-overlay" v-show="isLoading">
      <div>Loading...</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { VueConstructor } from 'vue';
import CustomTextFieldInterface from '../interfaces/custom-text-field.interface';
import BackgroundOffsetSettings from '../interfaces/background-offset-settings.interface';
import { PropType } from 'vue/types/options';
import { isServer } from '@vue-storefront/core/helpers';

import { InjectType } from 'src/modules/shared';

const SVG_NAMESPACE_URI = 'http://www.w3.org/2000/svg';

interface InjectedServices {
  window: Window
}

export default (Vue as VueConstructor<Vue & InjectedServices>).extend({
  name: 'MLivePreview',
  inject: {
    window: { from: 'WindowObject' }
  } as unknown as InjectType<InjectedServices>,
  props: {
    designSku: {
      type: String,
      default: undefined
    },
    templateFetchUrl: {
      type: String,
      required: true
    },
    accentColor: {
      type: String,
      default: undefined
    },
    customTextValues: {
      type: Object as PropType<Record<string, string | undefined>>,
      default: () => ({})
    }
  },
  data () {
    return {
      isLoading: true,
      previewContent: undefined as string | undefined,
      customTextFields: [] as CustomTextFieldInterface[]
    };
  },
  computed: {
    fullTemplateFetchUrl (): string {
      return this.templateFetchUrl + '/' + this.designSku + '/template.svg';
    }
  },
  methods: {
    getCustomizedSVG (
      targetSize: number,
      backgroundImage?: string
    ): string | undefined {
      const svg = this.getSvgContentElement();
      if (!svg) {
        return undefined;
      }

      const svgClone = svg.cloneNode(true) as HTMLElement;

      const svgNode = svgClone
        .getElementsByTagNameNS(SVG_NAMESPACE_URI, 'svg')
        .item(0);

      if (!svgNode) {
        return undefined;
      }

      svgNode.setAttributeNS('', 'height', targetSize.toString());
      svgNode.setAttributeNS('', 'width', targetSize.toString());

      if (!backgroundImage) {
        return this.restoreXmlTag(svgClone.innerHTML);
      }

      const backgroundContainer = svgClone
        .getElementsByClassName('background-image-container')
        .item(0);

      if (!backgroundContainer) {
        return this.restoreXmlTag(svg.innerHTML);
      }

      // We are creating the following element:
      // <image class="background-image" xlink:href="<dataURI>" width="<width>" height="<height>"" preserveAspectRatio="xMidYMid slice"/>

      const imageElement = this.window.document.createElementNS(
        SVG_NAMESPACE_URI,
        'image'
      );

      imageElement.setAttributeNS(
        'http://www.w3.org/1999/xlink',
        'xlink:href',
        backgroundImage
      );

      const height = backgroundContainer.getAttributeNS('', 'height');
      const width = backgroundContainer.getAttributeNS('', 'width');

      if (height && width) {
        imageElement.setAttributeNS('', 'height', height);
        imageElement.setAttributeNS('', 'width', width);
      }

      imageElement.setAttributeNS('', 'preserveAspectRatio', 'xMidYMid slice');
      imageElement.setAttributeNS('', 'class', 'background-image');

      backgroundContainer.appendChild(imageElement);

      return this.restoreXmlTag(svgClone.innerHTML);
    },
    getSvgContentElement (): HTMLElement | undefined {
      return this.$refs['svgContent'] as HTMLElement;
    },
    updateColorOnSvg () {
      const svgContainer = this.getSvgContentElement();

      if (!svgContainer) {
        return;
      }

      const coloredElements = svgContainer.getElementsByClassName('accent');

      for (let i = 0; i < coloredElements.length; i++) {
        const element = coloredElements[i] as HTMLElement;
        element.style.fill = this.accentColor;
      }
    },
    updateTextValuesPreview () {
      const svgContainer = this.getSvgContentElement();
      if (!svgContainer) {
        return;
      }

      const textFields = svgContainer.getElementsByClassName('custom-text');

      for (let i = 0; i < textFields.length; i++) {
        const field = textFields[i];

        if (!(field instanceof SVGTextElement)) {
          continue;
        }

        const fieldName = field.getAttribute('data-name');

        if (!fieldName) {
          continue;
        }

        field.textContent = this.customTextValues[fieldName] || '';

        this.adjustTextFontSize(field);
      }
    },
    adjustTextFontSize (field: SVGTextElement): void {
      const maxWidthRawValue = field.getAttribute('data-max-width');
      const maxFontSizeRawValue = field.getAttribute('data-max-font-size');

      if (!maxWidthRawValue || !maxFontSizeRawValue) {
        return;
      }

      const maxWidth = +maxWidthRawValue;
      const maxFontSize = +maxFontSizeRawValue;

      const referenceFontSize = 10;

      field.style.fontSize = referenceFontSize.toString() + 'px';

      if (!field.getBBox().width) {
        return;
      }

      let scale = (maxWidth / field.getBBox().width) * referenceFontSize;

      scale = Math.min(scale, maxFontSize);

      field.style.fontSize = scale.toString() + 'px';
    },
    restoreXmlTag (content: string) {
      const regex = /<!--\?xml (.+)\?-->/i;
      return content.replace(regex, '<?xml $1?>');
    },
    parsePreviewContent (): Document {
      if (!this.previewContent) {
        throw new Error('Preview content is absent!');
      }

      const parser = new DOMParser();

      return parser.parseFromString(this.previewContent, 'image/svg+xml');
    },
    prepareCustomTextFields (svg: Document) {
      this.customTextFields = [];
      const fields = svg.getElementsByClassName('custom-text');

      for (let i = 0; i < fields.length; i++) {
        const name = fields[i].getAttribute('data-name');
        if (!name) {
          continue;
        }

        const label = fields[i].getAttribute('data-label');
        const placeholder = fields[i].getAttribute('data-placeholder');
        const helperText = fields[i].getAttribute('data-helper-text');

        this.customTextFields.push({
          name,
          label: label || name,
          placeholder: placeholder || '',
          helperText: helperText || ''
        });
      }
    },
    countColoredElements (svg: Document): number {
      const fields = svg.getElementsByClassName('accent');

      return fields.length;
    },
    prepareBackgroundOffsetSettings (svg: Document): BackgroundOffsetSettings {
      const settings: BackgroundOffsetSettings = {};

      const backgroundContainer = svg.getElementById('background');

      if (!backgroundContainer) {
        return settings;
      }

      const offsetSize = backgroundContainer.getAttribute('data-offset-size');
      const offsetPosition = backgroundContainer.getAttribute(
        'data-offset-position'
      );

      settings.size = offsetSize || undefined;
      settings.position = offsetPosition || undefined;

      return settings;
    },
    async loadSvgTemplate () {
      if (isServer) {
        return;
      }

      this.isLoading = true;

      try {
        const response = await fetch(this.fullTemplateFetchUrl);

        if (!response.ok) {
          this.previewContent = undefined;
          throw new Error('SVG template was not loaded!');
        }

        this.previewContent = await response.text();

        const svgHtmlContent = this.parsePreviewContent();

        this.prepareCustomTextFields(svgHtmlContent);
        this.$emit('custom-text-fields-prepared', this.customTextFields);

        const accentColorElementsNumber =
          this.countColoredElements(svgHtmlContent);
        this.$emit('colored-elements-counted', accentColorElementsNumber);

        const backgroundOffsetSettings =
          this.prepareBackgroundOffsetSettings(svgHtmlContent);
        this.$emit(
          'background-offset-settings-prepared',
          backgroundOffsetSettings
        );
      } finally {
        this.isLoading = false;
      }
    }
  },
  updated (): void {
    this.updateColorOnSvg();
    this.updateTextValuesPreview();
  },
  watch: {
    designSku: {
      handler () {
        if (!this.designSku) {
          this.previewContent = undefined;
          return;
        }

        void this.loadSvgTemplate();
      },
      immediate: true
    },
    accentColor: {
      handler () {
        if (!this.accentColor) {
          return;
        }

        this.updateColorOnSvg();
      },
      immediate: false
    },
    customTextValues: {
      handler () {
        if (!this.customTextValues) {
          return;
        }

        this.updateTextValuesPreview();
      },
      deep: true,
      immediate: true
    }
  }
});
</script>

<style lang="scss" scoped>
@import "../../css/base/fonts";

$path: "/assets/fonts/";
$fonts: (
  "Adventure Normal": "Adventure-Normal",
  "Wilderness Typeface": "WildernessTypeface-Regular",
  "Wilderness Typeface Alt": "WildernessTypeface-Alt",
  "Vulpes": "Vulpes",
  "Courier New": "Courier-New",
);

@each $font-name, $font-file in $fonts {
  @include font-face($font-name, $path + $font-file, 400, normal);

  @media screen and (-webkit-min-device-pixel-ratio: 0) {
    @include font-face($font-name, $path + $font-file, 400, normal, svg);
  }
}

.m-live-preview {
  border: 1px dashed #a3a3a3;
  position: relative;
  padding-top: calc(100% - 2px);
  overflow: hidden;

  ._svg-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;

    ::v-deep svg {
      display: block;
    }
  }

  ._preview-overlay {
    align-items: center;
    background: rgba(0, 0, 0, 0.3);
    color: #ffffff;
    display: flex;
    font-weight: 500;
    height: 100%;
    left: 0;
    justify-content: center;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  &.-loading {
    ._svg-content {
      opacity: 0.5;
    }
  }
}
</style>
