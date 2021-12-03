<template>
  <div
    class="storyblok-homepage-intro-section"
    :class="cssClasses"
    :style="styles"
  >
    <div class="_intro-column _image-column">
      <BaseImage
        :srcsets="imageSources"
        :alt="itemData.title"
        :title="itemData.title"
        class="_image"
        v-if="itemData.image.filename"
      />
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
import { VueConstructor } from 'vue';
import { mapGetters } from 'vuex';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { nl2br } from 'src/modules/budsies';

import { InjectType } from 'src/modules/shared';
import { ComponentWidthCalculator } from 'src/modules/vsf-storyblok-module';
import { BaseImage, ImageSourceItem } from 'src/modules/budsies';
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import {
  SfButton,
  SfHeading
} from '@storefront-ui/vue';

import HomepageIntroSectionData from './interfaces/homepage-intro-section-data.interface';
import getUrlFromLink from './get-url-from-link';
import generateBreakpointsSpecs from './generate-breakpoints-specs';
import generateImageSourcesList from './generate-image-sources-list';

interface InjectedServices {
  componentWidthCalculator: ComponentWidthCalculator
}

export default (Blok as VueConstructor<InstanceType<typeof Blok> & InjectedServices>).extend({
  name: 'StoryblokHomepageIntroSection',
  components: {
    BaseImage,
    SfButton,
    SfHeading
  },
  inject: {
    componentWidthCalculator: { }
  } as unknown as InjectType<InjectedServices>,
  computed: {
    ...mapGetters({
      supportsWebp: 'storyblok/supportsWebp'
    }),
    itemData (): HomepageIntroSectionData {
      return this.item as HomepageIntroSectionData;
    },
    extraStyles (): Record<string, string> {
      const styles: Record<string, string> = {};

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
    imageSources (): ImageSourceItem[] {
      if (!this.itemData.image.filename) {
        return [];
      };

      const breakpointsSpecs = generateBreakpointsSpecs(
        this.itemData.image.filename,
        this.componentWidthCalculator,
        this.itemData.mobile_image.filename
      )

      return generateImageSourcesList(
        breakpointsSpecs,
        this.supportsWebp
      )
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

  ._intro-column {
    line-height: 0;
  }

  ._content {
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    padding: 1em;
    text-align: inherit;

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
  }

  &.-editor-preview-mode {
    ._button {
      pointer-events: none
    }
  }

  @media (min-width: $tablet-min) {
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
