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
          :alt="itemData.title"
          :title="itemData.title"
          class="_image"
          v-if="srcSet"
          @load.capture="onLoad"
        />
      </div>
    </div>

    <div class="_intro-column _content">
      <div class="_title-block">
        <SfHeading
          :level="2"
          :subtitle="itemData.subtitle"
        >
          <template #title>
            <h2
              class="sf-heading__title sf-heading__title--h2"
              v-html="nl2br(itemData.title)"
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
            v-if="itemData.button_text"
          >
            {{ itemData.button_text }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { nl2br } from 'src/modules/budsies';

import generatePlaceholderStyles from './generate-placeholder-styles';

import { Blok } from 'src/modules/vsf-storyblok-module/components';
import {
  SfImage,
  SfButton,
  SfHeading
} from '@storefront-ui/vue';

import SrcSetValue from './interfaces/src-set-value.interface';
import HomepageIntroSectionData from './interfaces/homepage-intro-section-data.interface';
import getUrlFromLink from './get-url-from-link';

export default Blok.extend({
  name: 'StoryblokHomepageIntroSection',
  components: {
    SfImage,
    SfButton,
    SfHeading
  },
  data () {
    return {
      isLoaded: false
    }
  },
  computed: {
    itemData (): HomepageIntroSectionData {
      return this.item as HomepageIntroSectionData;
    },
    extraCssClasses (): string[] {
      return !this.isLoaded ? ['-loading'] : [];
    },
    extraStyles (): Record<string, string> {
      const styles = generatePlaceholderStyles(
        this.itemData.image.filename,
        this.itemData.mobile_image.filename,
        'intro-section-image-height'
      );

      if (this.itemData.background_color.color) {
        styles['--intro-section-background-color'] = this.itemData.background_color.color;
      }

      if (this.itemData.text_color.color) {
        styles['--heading-title-color'] = this.itemData.text_color.color;
      }

      return styles;
    },
    link (): string {
      return getUrlFromLink(this.itemData.button_link);
    },
    srcSet (): SrcSetValue | string | undefined {
      if (!this.itemData.image.filename) {
        return undefined
      }

      if (!this.itemData.mobile_image.filename) {
        return this.itemData.image.filename;
      }

      const srcSet: SrcSetValue = {
        desktop: {
          url: this.itemData.image.filename
        },
        mobile: {
          url: this.itemData.mobile_image.filename
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
    },
    onLoad (): void{
      this.isLoaded = true;
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
      --image-width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  &.-loading {
    ._image-column {
      background-color: var(--intro-section-background-color, #fafafa);
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
