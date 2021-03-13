<template functional>
  <div class="o-header-minimal">
    <ALogo />
  </div>
</template>

<script>
import ALogo from 'theme/components/atoms/a-logo';
import Vue from 'vue'

Vue.component('ALogo', ALogo)

export default {
  name: 'OHeaderMinimal'
};
</script>

<style lang="scss" scoped>
.o-header-minimal {
  display: flex;
  .a-logo {
    margin: 0 auto;
  }
}
</style>
