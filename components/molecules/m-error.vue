<template>
  <div class="m-error error">
    <SfImage
      src="/assets/error.svg"
      class="error__image"
    />
    <SfHeading :level="level" :title="title" :subtitle="subtitle" class="error__message" />
    <div class="error__action">
      <a :href="localizedRoute('/')">
        <SfButton class="sf-button--full-width error__action-button">
          {{ $t("Return to home") }}
        </SfButton>
      </a>
      <SfButton
        class="sf-button--full-width sf-button--text error__action-button error__action-button--secondary"
        @click="$router.back()"
      >
        {{ $t("Back") }}
      </SfButton>
    </div>
  </div>
</template>

<script>
import { SfButton, SfImage, SfHeading } from '@storefront-ui/vue';

export default {
  name: 'MError',
  components: { SfButton, SfImage, SfHeading },
  props: {
    level: {
      type: Number,
      default: 1
    },
    title: {
      type: String,
      default: ''
    },
    subtitle: {
      type: String,
      default: ''
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.error {
  margin: auto;
  padding: 0 1.25rem;
  &__image,
  &__message {
    margin: calc(var(--spacer-xl) * 2) 0;
    text-align: center;
    --heading-border: none;
  }
  &__image {
    display: flex;
    justify-content: center;
  }
  &__action {
    max-width: 24rem;
    margin: var(--spacer-2xl) auto;
    @include for-desktop {
      display: flex;
    }
  }
  &__action-button {
    flex: 1;
    &--secondary {
      margin: var(--spacer-xl) 0;
      @include for-desktop {
        margin: 0;
        text-align: right;
      }
    }
  }
}
</style>
