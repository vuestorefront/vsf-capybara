<template>
  <div class="storyblok-heading" :class="cssClasses" :style="styles">
    <div class="_container">
      <div class="_intro" v-if="isCustomStyled && itemData.intro_text">
        {{ itemData.intro_text }}
      </div>

      <SfHeading
        class="_heading"
        :level="headingSize"
        :title="itemData.title"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { SfHeading } from '@storefront-ui/vue';
import { Blok } from 'src/modules/vsf-storyblok-module/components';
import HeadingData from './interfaces/heading-data.interface';

export default Blok.extend({
  name: 'StoryblokHeading',
  components: {
    SfHeading
  },
  computed: {
    itemData (): HeadingData {
      return this.item as HeadingData;
    },
    extraCssClasses (): string[] {
      const result: string[] = [];

      result.push('-h' + this.headingSize);

      if (this.isCustomStyled) {
        result.push('-custom-styled');
      }

      if (this.itemData.alignment) {
        result.push('-aligned-' + this.itemData.alignment);
      }

      return result;
    },
    headingSize (): number {
      const value = Number(this.itemData.heading_type);
      return !isNaN(value) ? value : 1;
    },
    isCustomStyled (): boolean {
      return !!this.itemData.is_custom_styled;
    }
  }
});
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
@import "src/modules/vsf-storyblok-module/components/defaults/mixins";

.storyblok-heading {
  text-align: center;

  ._heading {
    text-align: inherit;
  }

  &.-custom-styled {
    overflow: hidden;
    margin-left: 1em;
    margin-right: 1em;
    padding: var(--heading-padding, var(--spacer-xs) 0 var(--spacer-xs) 0);
    text-align: center;

    ._container {
      display: inline-block;
    }

    ._intro {
      color: var(--c-warning);

      font-family: var(--font-family-intro);
      font-weight: 400;
      margin-left: -0.4em;
      padding-left: 0.2em;
      padding-right: 0.2em;
      text-align: left;
    }

    ._heading {
      padding: 0;
    }

    ._intro + ._heading ::v-deep .sf-heading__title {
      line-height: 1;
    }

    &.-h1,
    &.-h2 {
      ._intro + ._heading {
        margin-top: -0.6em;
      }
    }

    &.-h3,
    &.-h4 {
      ._intro + ._heading {
        margin-top: -0.4em;
      }
    }

    &.-h5 {
      ._intro + ._heading {
        margin-top: -0.2em;
      }
    }

    @for $i from 1 through 6 {
      &.-h#{$i} {
        ._intro {
          font-size: calc(var(--h#{$i}-font-size) * 1.15);
        }
      }
    }

    &.-aligned-left,
    &.-aligned-right {
      ._intro {
        margin-left: 0;
      }
    }

    &.-aligned-right {
      ._intro {
        text-align: right;
      }
    }
  }

  @media (min-width: $tablet-min) {
    &.-custom-styled {
      ._intro {
        margin-left: -0.6em;
      }

      ._heading {
        position: relative;

        &::after,
        &::before {
          background: var(--heading-title-color, var(--c-text));
          content: "";
          height: 1px;
          position: absolute;
          top: calc(50% + 1px);
          width: 50vw;
        }

        &::after {
          left: 100%;
          margin-left: 0.5em;
        }

        &::before {
          margin-right: 0.5em;
          right: 100%;
        }
      }

      &.-h1,
      &.-h2 {
        ._heading {
          &::after,
          &::before {
            top: calc(50% + 2px);
          }
        }
      }
    }
  }

  @include for-desktop {
    &.-custom-styled {
      &.-h1,
      &.-h2 {
        ._intro + ._heading {
          margin-top: -1em;
        }
      }

      &.-h3 {
        ._intro + ._heading {
          margin-top: -0.6em;
        }
      }

      &.-h2 {
        ._heading {
          &::after,
          &::before {
            height: 2px;
          }
        }
      }
    }
  }

  @include display-property-handling;
}
</style>
