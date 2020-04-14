<template>
  <div class="minimal-layout">
    <div id="viewport">
      <OHeaderMinimal />
      <slot />
      <OFooter />
    </div>
  </div>
</template>

<script>
import OHeaderMinimal from 'theme/components/organisms/o-header-minimal';
import OFooter from 'theme/components/organisms/o-footer';

export default {
  components: {
    OHeaderMinimal,
    OFooter
  }
}
</script>
