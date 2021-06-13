<template>
  <div
    class="storyblok-homepage-intro-section"
    :class="cssClasses"
    :style="{ backgroundColor: item.background_color }"
  >
    <div class="_intro-column _image">
      <SfImage
        :src="srcSet"
        :picture-breakpoint="768"
      />
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
          >
            {{ item.button_text }}
          </SfButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { nl2br } from 'src/modules/budsies';

import { Blok } from 'src/modules/vsf-storyblok-module/components';
import {
  SfImage,
  SfButton,
  SfHeading
} from '@storefront-ui/vue';

import SrcSetValue from './src-set-value.interface';

export default Blok.extend({
  name: 'StoryblokHomepageIntroSection',
  components: {
    SfImage,
    SfButton,
    SfHeading
  },
  computed: {
    link (): string {
      return this.item.button_link.url;
    },
    srcSet (): SrcSetValue | string {
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

  ._image {
    img {
      width: 100%;
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
