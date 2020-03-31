<template>
  <div class="a-loading-spinner">
    <SfLoader :loading="true" />
  </div>
</template>
<script>
import { SfLoader } from '@storefront-ui/vue';
export default {
  name: 'ALoadingSpinner',
  components: { SfLoader }
};
</script>
<style lang="scss" scoped>
.a-loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
