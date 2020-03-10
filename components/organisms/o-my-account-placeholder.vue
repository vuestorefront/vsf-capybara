<template>
  <SfTabs :open-tab="1" class="o-my-account-placeholder">
    <SfTab :title="title">
      <p class="message">
        {{ $t('This feature is not implemented yet! Please take a look at') }}<br>
        <a href="#">https://github.com/DivanteLtd/vue-storefront/issues {{ $t('for our Roadmap!') }}</a>
      </p>
    </SfTab>
  </SfTabs>
</template>

<script>
import { SfTabs } from '@storefront-ui/vue';
export default {
  name: 'OMyAccountPlaceholder',
  components: { SfTabs },
  props: {
    title: {
      type: String,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.message {
  margin: 0 0 var(--spacer-extra-big) 0;
  font-size: var(--font-size-regular);
  font-family: var(--body-font-family-primary);
  font-weight: var(--body-font-weight-primary);
  line-height: 1.6;
}
.o-my-account-placeholder {
  @include for-mobile {
    ::v-deep .sf-tabs {
      &__title {
        display: none;
      }
      &__content {
        border: 0;
        padding: 0;
      }
    }
  }
}
</style>
