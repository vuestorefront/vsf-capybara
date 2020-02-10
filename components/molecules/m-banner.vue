<template>
  <section :id="getBannerId" class="sf-banner" v-on="isMobile ? $listeners : {}">
    <v-style>
      .no-webp #banner_{{_uid}} {
        background-image: url({{ image.fallback }});
      }
      .webp #banner_{{_uid}} {
        background-image: url({{ image.webp }});
      }
    </v-style>
    <div class="sf-banner__container">
      <slot name="subtitle" v-bind="{ subtitle }">
        <h2 v-if="subtitle" class="sf-banner__subtitle">
          {{ subtitle }}
        </h2>
      </slot>
      <slot name="title" v-bind="{ title }">
        <h1 v-if="title" class="sf-banner__title">
          {{ title }}
        </h1>
      </slot>
      <slot name="description" v-bind="{ description }">
        <p v-if="description" class="sf-banner__description">
          {{ description }}
        </p>
      </slot>
      <slot name="call-to-action" v-bind="{ buttonText }">
        <SfButton
          v-if="buttonText"
          class="sf-banner__call-to-action color-secondary"
          v-on="!isMobile ? $listeners : {}"
        >
          {{ buttonText }}
        </SfButton>
      </slot>
    </div>
  </section>
</template>

<script>
import {
  SfBanner
} from '@storefront-ui/vue';

export default {
  name: "ABanner",
  mixins: [SfBanner],
  computed: {
    getBannerId () {
      return `banner_${this._uid}`
    }
  }
}
</script>