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

$intro-left-margin: 1em;

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
      position: relative;
      padding-top: 0.75em;
      padding-left: 0.5 * $intro-left-margin;
      padding-right: 0.5 * $intro-left-margin;
    }

    ._intro {
      display: inline;
      position: absolute;
      left: auto;
      color: var(--c-warning);
      font-family: var(--font-family-intro);
      font-weight: 400;
      margin-top: -0.75em;
      margin-left: -0.5 * $intro-left-margin;
    }

    ._heading {
      display: inline;
      padding: 0;

      ::v-deep .sf-heading__title {
        display: inline;
      }
    }

    @for $i from 1 through 6 {
      &.-h#{$i} {
        ._container {
          font-size: calc(var(--h#{$i}-font-size) * 1.15);
        }
      }
    }

    &.-aligned-left {
      text-align: left;
    }

    &.-aligned-right {
      text-align: right;
    }
  }

  @media (min-width: $tablet-min) {
    &.-custom-styled {
      ._container {
        padding-left: $intro-left-margin;
        padding-right: $intro-left-margin;
      }

      ._intro {
        margin-left: -1 * $intro-left-margin;
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
