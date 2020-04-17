<template>
  <div class="default-layout">
    <MLoader />
    <div id="viewport">
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
      <MOfflineBadge />
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
import MLoader from 'theme/components/molecules/m-loader';
import ONotification from 'theme/components/organisms/o-notification';
import MCookieNotification from 'theme/components/molecules/m-cookie-notification';
import MOfflineBadge from 'theme/components/molecules/m-offline-badge';
import { isServer } from '@vue-storefront/core/helpers';
import Head from 'theme/head';
import config from 'config';
import { SfSidebar } from '@storefront-ui/vue';
import ALoadingSpinner from 'theme/components/atoms/a-loading-spinner';
import ALoadingError from 'theme/components/atoms/a-loading-error';
import { ModalList } from 'theme/store/ui/modals'

const OMicrocart = () =>
  import(/* webpackChunkName: "vsf-microcart" */ 'theme/components/organisms/o-microcart');

export default {
  components: {
    OHeader,
    OFooter,
    MLoader,
    ONotification,
    MCookieNotification,
    MOfflineBadge,
    OBottomNavigation,
    SfSidebar,
    OModal
  },
  data () {
    return {
      quicklink: null,
      microcartAsyncComponent: () => ({
        component: OMicrocart(),
        loading: ALoadingSpinner,
        error: ALoadingError,
        timeout: 3000
      })
    };
  },
  computed: {
    ...mapState({
      isMicrocartOpen: state => state.ui.microcart
    }),
    quicklinkEnabled () {
      return typeof config.quicklink !== 'undefined' && config.quicklink.enabled
    }
  },
  beforeMount () {
    // Progress bar on top of the page
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      this.$Progress.increase(40);
      next();
    });
    this.$router.afterEach(() => {
      if (!isServer && this.quicklinkEnabled) {
        this.quicklink.listen();
      }
      this.$Progress.finish();
    });
    this.$bus.$on('offline-order-confirmation', this.onOrderConfirmation);
  },
  mounted () {
    if (!isServer && this.quicklinkEnabled) {
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
      this.openModal({name: ModalList.OrderConfirmation, payload});
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
        loading: ALoadingSpinner,
        error: ALoadingError,
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
