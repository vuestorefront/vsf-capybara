<template>
  <div class="o-header-minimal">
    <ALogo />
  </div>
</template>

<script>
import ALogo from 'theme/components/atoms/a-logo';

export default {
  name: 'OHeaderMinimal',
  components: { ALogo }
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
