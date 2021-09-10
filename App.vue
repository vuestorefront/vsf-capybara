<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import get from 'lodash-es/get'
const DefaultLayout = () => import(/* webpackChunkName: "vsf-layout-default" */ './layouts/Default')
const MinimalLayout = () => import(/* webpackChunkName: "vsf-layout-minimal" */ './layouts/Minimal')

export default {
  components: {
    DefaultLayout,
    MinimalLayout
  },
  computed: {
    layout () {
      return `${get(this.$route, 'meta.layout', 'default')}-layout`
    }
  }
};
</script>

<style lang="scss" src="theme/css/main.scss"></style>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
body {
  --sidebar-aside-z-index: 2;
  --sidebar-z-index: 2;
  --bottom-navigation-height: 3.75rem;
  --footer-height: 345px;
  --_header-height: 80px;
  --_header-mobile-height: 50px;
  --select-dropdown-z-index: 2;
  --bar-height: 3.125rem;
  --notification-font-size: var(--font-sm);
  font-family: var(--font-family-secondary);
  margin: 0;
  padding: 0;
  a {
    text-decoration: none;
    color: var(--c-link);
    cursor: pointer;
    &:hover {
      color: var(--c-link-hover);
    }
  }
  .sf-select {
    &__dropdown {
      padding-bottom: env(safe-area-inset-bottom); //safe area padding for dropdown
    }
  }
  .global--max-width {
    min-height: calc(100vh - var(--_header-mobile-height) - var(--bottom-navigation-height));
    @include for-desktop {
      min-height: calc(100vh - var(--_header-height) - var(--footer-height));
      max-width: 1272px;
    }
  }
}

#viewport {
  position: relative;
}

@include for-desktop {
  .sidebar {
    &__microcart {
      --sidebar-aside-width: 700px;
    }
  }
}
</style>
