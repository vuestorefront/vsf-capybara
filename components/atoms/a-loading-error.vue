<template>
  <div class="a-loading-error">
    <SfAlert
      :message="OnlineOnly
        ? $t('An error occured while loading the component.')
        : $t('Component couldn\'t be loaded due to lack of network connectivity.')"
      type="danger"
    />
    <SfButton
      v-if="OnlineOnly"
      class="sf-button--text color-secondary"
      @click="$emit('reload')"
    >
      {{ $t('Try again') }}
    </SfButton>
    <SfButton
      class="sf-button--text color-secondary"
      @click="$emit('close')"
    >
      {{ $t('Close') }}
    </SfButton>
  </div>
</template>

<script>
import VueOfflineMixin from 'vue-offline/mixin';
import { SfButton, SfAlert } from '@storefront-ui/vue';

export default {
  name: 'ALoadingError',
  components: { SfButton, SfAlert },
  mixins: [VueOfflineMixin],
  mounted () {
    this.$on('online', () => this.$emit('reload'));
  }
};
</script>

<style lang="scss" scoped>
.a-loading-error {
  display: flex;
  justify-content: center;
  align-content: center;
  flex-wrap: wrap;
  width: 100%;
  height: 100vh;
  margin: auto;
  .sf-alert {
    flex-basis: 100%;
    justify-content: center;
  }
  .sf-button {
    margin: 0 1em;
  }
}
</style>
