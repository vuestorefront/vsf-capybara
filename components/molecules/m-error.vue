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
  display: flex;
  flex-direction: column;
  height: 70vh;
  justify-content: center;
  align-items: center;
  flex: 1;

  &__action {
    margin-top: var(--spacer-2xl);
    @include for-desktop {
      display: flex;
    }
  }
  &__action-button {
    flex: 1;
    &--secondary {
      margin-top: var(--spacer-xl);
      @include for-desktop {
        margin: auto var(--spacer-2xl);
      }
    }
  }
}
</style>
