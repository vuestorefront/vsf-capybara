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

import { FileProcessingRepositoryFactory, itemFactory } from 'src/modules/file-storage'
import { ErrorConverterService } from 'src/modules/budsies'

const errorConverterService = new ErrorConverterService();
const fileProcessingRepositoryFactory = new FileProcessingRepositoryFactory(
  itemFactory
);

export default {
  components: {
    DefaultLayout,
    MinimalLayout
  },
  computed: {
    layout () {
      return `${get(this.$route, 'meta.layout', 'default')}-layout`
    }
  },
  provide: {
    ErrorConverterService: errorConverterService,
    FileProcessingRepositoryFactory: fileProcessingRepositoryFactory
  }
};
</script>

<style lang="scss">
@import "~@storefront-ui/vue/styles";
</style>
<style lang="scss">
@import "./css/main";
html {
  font-size: var(--font-size-base);
}

body {
  --overlay-z-index: 1;
  --sidebar-aside-z-index: 2;
  --sidebar-z-index: 2;
  --bottom-navigation-height: 3.75rem;
  --bar-height: 3.125rem;
  --notification-font-size: var(--font-sm);
  font-family: var(--font-family-secondary);
  font-weight: var(--font-normal);
  line-height: #{$line-height-base};
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

html,
body,
#app,
.default-layout,
#viewport {
  height: 100%;
}

#viewport {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .content {
    flex: 1 0 auto;
  }
  .o-footer {
    flex: 0 0 auto;
  }
}

@include for-desktop {
  .sidebar {
    &__microcart {
      --sidebar-aside-width: 700px;
    }
  }
}
</style>
