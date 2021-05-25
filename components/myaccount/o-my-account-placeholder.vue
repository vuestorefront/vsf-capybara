<template>
  <SfTabs :open-tab="1" class="o-my-account-placeholder tab-orphan">
    <SfTab :title="title">
      <p class="message">
        {{ $t('This feature is not implemented yet! Please take a look at') }}
        <a href="https://github.com/DivanteLtd/vue-storefront"> https://github.com/DivanteLtd/vue-storefront </a>
        {{ $t('for our Roadmap!') }}
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

.tab-orphan {
  @include for-mobile {
    --tabs-title-display: none;
    --tabs-content-padding: 0;
    --tabs-conent-border-width: 0;
  }
}
.message {
  margin: 0 0 var(--spacer-sm) 0;
  color: var(--c-dark-variant);
}
a {
  font-weight: var(--font-medium);
  color: var(--c-primary);
  text-decoration: none;
  &:hover {
    color: var(--c-text);
  }
}
</style>
