<template>
  <div class="default-layout">
    <loader />
    <div id="viewport" class="w-100 relative">
      <OHeader />
      <SfSidebar
        :visible="isMicrocartOpen"
        class="sf-sidebar--right sidebar__microcart"
        @close="$store.commit('ui/setMicrocart')"
      >
        <component
          v-if="isMicrocartOpen"
          :is="microcartAsyncComponent"
          @close="$store.commit('ui/setMicrocart')"
          @reload="reloadComponent()"
        />
      </SfSidebar>
      <slot />
      <OFooter />
      <OModal />
      <ONotification />
      <MCookieNotification />
      <OfflineBadge />
      <OBottomNavigation />
    </div>
    <vue-progress-bar />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import OHeader from 'theme/components/organisms/o-header';
import OFooter from 'theme/components/organisms/o-footer';
import OModal from 'theme/components/organisms/o-modal';
import OBottomNavigation from 'theme/components/organisms/o-bottom-navigation';
import Loader from 'theme/components/core/Loader';
import ONotification from 'theme/components/organisms/o-notification';
import MCookieNotification from 'theme/components/molecules/m-cookie-notification';
import OfflineBadge from 'theme/components/core/OfflineBadge';
import { isServer } from '@vue-storefront/core/helpers';
import Head from 'theme/head';
import config from 'config';
import { SfSidebar } from '@storefront-ui/vue';
import LoadingSpinner from 'theme/components/theme/blocks/AsyncSidebar/LoadingSpinner';
import LoadingError from 'theme/components/theme/blocks/AsyncSidebar/LoadingError';
import { ModalList } from 'theme/store/ui/modals'

const OMicrocart = () =>
  import(/* webpackChunkName: "vsf-microcart" */ 'theme/components/organisms/o-microcart');

export default {
  components: {
    OHeader,
    OFooter,
    Loader,
    ONotification,
    MCookieNotification,
    OfflineBadge,
    OBottomNavigation,
    SfSidebar,
    OModal
  },
  data () {
    return {
      quicklink: null,
      microcartAsyncComponent: () => ({
        component: OMicrocart(),
        loading: LoadingSpinner,
        error: LoadingError,
        timeout: 3000
      })
    };
  },
  computed: {
    ...mapState({
      isMicrocartOpen: state => state.ui.microcart
    })
  },
  beforeMount () {
    // Progress bar on top of the page
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      this.$Progress.increase(40);
      next();
    });
    this.$router.afterEach(() => {
      if (!isServer) {
        this.quicklink.listen();
      }
      this.$Progress.finish();
    });
    this.$bus.$on('offline-order-confirmation', this.onOrderConfirmation);
  },
  mounted () {
    if (!isServer) {
      this.quicklink = require('quicklink');
      this.quicklink.listen();
    }
    this.$store.dispatch('ui/checkWebpSupport');
  },
  beforeDestroy () {
    this.$bus.$off('offline-order-confirmation', this.onOrderConfirmation);
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    onOrderConfirmation (payload) {
      ;
      this.openModal({name: ModalList.OrderConfirmation, payload: [payload]})
    },
    fetchMenuData () {
      return this.$store.dispatch('category/list', {
        level:
          config.entities.category.categoriesDynamicPrefetch &&
          config.entities.category.categoriesDynamicPrefetchLevel >= 0
            ? config.entities.category.categoriesDynamicPrefetchLevel
            : null,
        includeFields:
          config.entities.optimize && isServer
            ? config.entities.category.includeFields
            : null,
        skipCache: isServer
      });
    },
    reloadComponent () {
      this.microcartAsyncComponent = () => ({
        component: OMicrocart(),
        loading: LoadingSpinner,
        error: LoadingError,
        timeout: 3000
      });
    }
  },
  serverPrefetch () {
    return Promise.all([
      this.$store.dispatch('promoted/updatePromotedOffers'),
      this.fetchMenuData()
    ]);
  },
  metaInfo: Head
};
</script>

<style lang="scss" src="theme/css/main.scss"></style>
<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";
body {
  --overlay-z-index: 1;
  --sidebar-aside-z-index: 2;
  --bottom-navigation-height: 3.75rem;
  --bar-height: 3.125rem;
  color: var(--c-text);
  font-size: var(--font-size-regular);
  font-family: var(--body-font-family-secondary);
  font-weight: var(--body-font-weight-primary);
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

@include for-desktop {
  .sidebar {
    &__microcart {
      --sidebar-aside-width: 700px;
    }
  }
}
</style>
