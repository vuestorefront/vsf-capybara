<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import get from 'lodash-es/get'
import DefaultLayout from './layouts/Default'
import MinimalLayout from './layouts/Minimal'

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
  --overlay-z-index: 1;
  --sidebar-aside-z-index: 2;
  --sidebar-z-index: 2;
  --bottom-navigation-height: 3.75rem;
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
