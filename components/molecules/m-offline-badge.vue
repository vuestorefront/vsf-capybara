<template>
  <no-ssr>
    <SfNotification
      :visible="OfflineOnly"
      class="m-offline-badge"
      :message="$t('You are offline. Some features might not be available.')"
      type="danger"
    >
      <template #close>
&nbsp;
      </template>
    </SfNotification>
  </no-ssr>
</template>

<script>
import NoSSR from 'vue-no-ssr';
import VueOfflineMixin from 'vue-offline/mixin';
import { SfNotification } from '@storefront-ui/vue';

export default {
  components: {
    'no-ssr': NoSSR,
    SfNotification
  },
  mixins: [VueOfflineMixin]
};
</script>

<style lang="scss" scoped>
.m-offline-badge {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 3;
  border-radius: 0;
  max-width: none;
  justify-content: center;
}
</style>
