<template>
  <section
    :id="'cta_' + uniqueId"
    class="sf-call-to-action"
  >
    <v-style>
      .no-webp #cta_{{ uniqueId }} {
      background-image: url({{ image.fallback }});
      }
      .webp #cta_{{ uniqueId }} {
      background-image: url({{ image.webp }});
      }
    </v-style>
    <div class="sf-call-to-action__text-container">
      <!--@slot Use this slot to replace title-->
      <slot name="title" v-bind="{ title }">
        <h2 v-if="title" class="sf-call-to-action__title">
          {{ title }}
        </h2>
      </slot>
      <!--@slot Use this slot to replace description-->
      <slot name="description" v-bind="{ description }">
        <p v-if="description" class="sf-call-to-action__description">
          {{ description }}
        </p>
      </slot>
    </div>
    <!--@slot Use this slot to replace bottom button-->
    <slot name="button" v-bind="{ buttonText }">
      <SfButton v-if="buttonText" class="sf-call-to-action__button">
        {{ buttonText }}
      </SfButton>
    </slot>
  </section>
</template>

<script>
import {
  SfCallToAction
} from '@storefront-ui/vue';

export default {
  name: 'MCallToAction',
  mixins: [SfCallToAction],
  props: {
    uniqueId: {
      type: String,
      default: ''
    },
    image: {
      type: [String, Object],
      default: () => ({ webp: { url: '' }, fallback: { url: '' } })
    }
  }
}
</script>
