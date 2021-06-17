<template>
  <div
    class="storyblok-homepage-intro-section"
    :class="cssClasses"
    :style="styles"
  >
    <div class="_intro-column _image-column">
      <div class="_image-wrapper">
        <SfImage
          :src="srcSet"
          :picture-breakpoint="768"
          class="_image"
          v-if="srcSet"
        />
      </div>
    </div>

    <div class="_intro-column _content">
      <div class="_title-block">
        <SfHeading
          :level="2"
          :subtitle="item.subtitle"
        >
          <template #title>
            <h2
              class="sf-heading__title sf-heading__title--h2"
              v-html="nl2br(item.title)"
            />
          </template>

          <template #subtitle="{ subtitle }">
            <h3
              class="_subtitle sf-heading__title sf-heading__title--h3"
              v-if="subtitle"
            >
              {{ subtitle }}
            </h3>
          </template>
        </SfHeading>

        <div class="_button-row">
          <SfButton
            :link="link"
            class="_button"
            @click="openLink"
            v-if="item.button_text"
          >
            {{ item.button_text }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType } from 'vue';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { nl2br } from 'src/modules/budsies';

import parseImageDimensions from './parse-image-dimensions';

import { Blok } from 'src/modules/vsf-storyblok-module/components';
import {
  SfImage,
  SfButton,
  SfHeading
} from '@storefront-ui/vue';

import SrcSetValue from './interfaces/src-set-value.interface';
import HomepageIntroSectionData from './interfaces/homepage-intro-section-data.interface';

export default Blok.extend({
  name: 'StoryblokHomepageIntroSection',
  components: {
    SfImage,
    SfButton,
    SfHeading
  },
  props: {
    item: {
      type: Object as PropType<HomepageIntroSectionData>,
      required: true
    }
  },
  computed: {
    extraStyles (): Record<string, string> {
      const styles: Record<string, string> = {};

      if (this.item.background_color.color) {
        styles['--intro-section-background-color'] = this.item.background_color.color;
      }

      if (this.item.text_color.color) {
        styles['--heading-title-color'] = this.item.text_color.color;
      }

      if (!this.item.image.filename) {
        return styles;
      }

      let dimensions = parseImageDimensions(this.item.image.filename);

      let ratio = dimensions.height / dimensions.width * 100;

      styles['--intro-section-image-height'] = ratio + '%';

      if (!this.item.mobile_image.filename) {
        return styles;
      }

      dimensions = parseImageDimensions(this.item.mobile_image.filename);

      ratio = dimensions.height / dimensions.width * 100;

      styles['--intro-section-image-height-mobile'] = ratio + '%';

      return styles;
    },
    link (): string {
      return this.item.button_link.url;
    },
    srcSet (): SrcSetValue | string | undefined {
      if (!this.item.image.filename) {
        return undefined
      }

      if (!this.item.mobile_image.filename) {
        return this.item.image.filename;
      }

      const srcSet: SrcSetValue = {
        desktop: {
          url: this.item.image.filename
        },
        mobile: {
          url: this.item.mobile_image.filename
        }
      };

      return srcSet;
    }
  },
  methods: {
    nl2br (text: string): string {
      return nl2br(text);
    },
    openLink (): void {
      this.$router.push(localizedRoute(this.link));
    }
  }
})
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.storyblok-homepage-intro-section {
  position: relative;

  ._content {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 1em;
    text-align: inherit;
    z-index: 10;

    ._title-block {
      .sf-heading__title {
        line-height: 1.2;
      }

      ._subtitle {
        margin-top: 1em;
      }
    }

    ._button-row {
      margin-top: 2em;
      text-align: center;;
    }

    ._button {
      display: inline-block;
    }

    &.-desktop {
      display: none;
    }
  }

  ._image-column {
    background-color: var(--intro-section-background-color, transparent);
    position: relative;

    ._image-wrapper {
      padding-top: var(--intro-section-image-height-mobile, var(--intro-section-image-height, 0));
    }

    ._image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      img {
        width: 100%;
      }
    }
  }

  @media (min-width: $tablet-min) {
    ._image-column {
      ._image-wrapper {
        padding-top: var(--intro-section-image-height, 0);
      }
    }
    ._content {
      padding: 0 5% 0 55%;
      position: absolute;
      top: 0;
      left: 0;

      ._title-block {
        .sf-heading__title {
          text-align: left;
        }

        ._button-row {
          text-align: left;
        }
      }
    }

  }
}
</style>
