<template>
  <div
    class="storyblok-homepage-intro-section _intro-row"
    :class="cssClasses"
    :style="{ backgroundColor: item.background_color }"
  >
    <div class="_intro-row">
      <div class="_intro-column _content">
        <h2>
          <sb-rich-text :text="item.textarea" />
        </h2>
        <p class="_subtitle" v-if="item.subtitle_content">
          {{ item.subtitle_content }}
        </p>
        <div class="_content-btn">
          <SfButton
            :link="item.button_link"
            :target="_self"
          >
            {{ item.button_text_required }}
          </SfButton>
        </div>
      </div>
      <div class="_intro-column _image">
        <SfImage
          :src="srcSet"
          :picture-breakpoint="768"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import { SfImage } from '@storefront-ui/vue';
import { SfButton } from '@storefront-ui/vue';

interface SrcSetValue {
  desktop?: { url: string },
  mobile?: { url: string }
}

export default Blok.extend({
  name: 'StoryblokHomepageIntroSection',
  components: {
    SfImage,
    SfButton
  },
  computed: {
    link (): string {
      return this.item.link_url.url;
    },
    linkTarget (): string {
      return this.item.target_blank ? '_blank'
        : '_self';
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
  }
})
</script>

<style lang="scss" scoped>
.storyblok-homepage-intro-section {
  position: relative;

  ._intro-row {
    position: relative;

    ._content {
      display: flex;
      flex-direction: column;
      height: 100%;
      justify-content: center;
      order: 2;
      padding: 0 5% 0 55%;
      position: absolute;
      text-align: inherit;
      width: 100%;
      z-index: 10;

      ._subtitle {
        font-size: 1.2em;
      }

      h2 {
        font-size: 1.8em;
        text-align: inherit;
        margin: 0;

        p {
          font-size: inherit;
          font-weight: inherit;
          line-height: 1.2em;
          margin: 0;
        }
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

    ._button {
      margin-top: 2em;
      text-align: center;
    }
  }
}
</style>
