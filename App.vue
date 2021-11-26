<template>
  <div id="app">
    <component :is="layout">
      <router-view />
    </component>
  </div>
</template>

<script>
import get from 'lodash-es/get'
import config from 'config';
import { mapState } from 'vuex';

import DefaultLayout from './layouts/Default'
import MinimalLayout from './layouts/Minimal'

import { FileProcessingRepositoryFactory, ImageHandlerService, itemFactory } from 'src/modules/file-storage'
import { ErrorConverterService } from 'src/modules/budsies'
import { isServer } from '@vue-storefront/core/helpers'

const windowObject = isServer ? {} : window;
const errorConverterService = new ErrorConverterService();
const fileProcessingRepositoryFactory = new FileProcessingRepositoryFactory(
  itemFactory
);
const imageHandlerService = new ImageHandlerService(
  config.images.imageHandlerServiceUrl
)

export default {
  components: {
    DefaultLayout,
    MinimalLayout
  },
  computed: {
    ...mapState({
      loggedUser: (state) => state.user.current
    }),
    layout () {
      return `${get(this.$route, 'meta.layout', 'default')}-layout`
    }
  },
  provide: {
    ErrorConverterService: errorConverterService,
    FileProcessingRepositoryFactory: fileProcessingRepositoryFactory,
    ImageHandlerService: imageHandlerService,
    WindowObject: windowObject
  },
  created () {
    this.$router.afterEach(() => {
      this.updateDataLayer();
    })
  },
  methods: {
    updateDataLayer () {
      if (!windowObject.dataLayer || !this.loggedUser) {
        return;
      }

      windowObject.dataLayer.push({
        customerEmail: this.loggedUser.email,
        customerFullName: `${this.loggedUser.firstname} ${this.loggedUser.lastname}`,
        customerId: this.loggedUser.id
      })
    }
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
.default-layout {
  height: 100%;
}

#viewport {
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100%;
  .content {
    display: flex;
    flex: 1 0 auto;
    flex-direction: column;
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
