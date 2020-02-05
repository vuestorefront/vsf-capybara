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
@import "~@storefront-ui/vue/styles";
@mixin for-mobile {
  @media screen and (max-width: $desktop-min) {
    @content;
  }
}
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.message {
  margin: 0 0 $spacer-extra-big 0;
  font-size: $font-size-regular-mobile;
  font-family: $body-font-family-primary;
  font-weight: $body-font-weight-primary;
  line-height: 1.6;
  @include for-desktop {
    font-size: $font-size-regular-desktop;
  }
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
