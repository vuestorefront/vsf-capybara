<template>
  <div class="minimal-layout">
    <div id="viewport">
      <OHeaderMinimal />
      <slot />
      <LazyHydrate when-visible>
        <OFooter />
      </LazyHydrate>
    </div>
  </div>
</template>

<script>
import OHeaderMinimal from 'theme/components/organisms/o-header-minimal';
import LazyHydrate from 'vue-lazy-hydration'

export default {
  components: {
    OHeaderMinimal,
    OFooter: () => import('theme/components/organisms/o-footer'),
    LazyHydrate
  }
}
</script>
