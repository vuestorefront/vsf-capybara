<template>
  <div class="default-layout">
    <MLoader />
    <div id="viewport">
      <OHeader />
      <OMicrocart />
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
import { mapActions } from 'vuex';
import OHeader from 'theme/components/organisms/o-header';
import OMicrocart from 'theme/components/organisms/o-microcart';
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
import { ModalList } from 'theme/store/ui/modals'

export default {
  components: {
    OHeader,
    OMicrocart,
    OFooter,
    MLoader,
    ONotification,
    MCookieNotification,
    MOfflineBadge,
    OBottomNavigation,
    OModal
  },
  data () {
    return {
      quicklink: null
    };
  },
  computed: {
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
      this.openModal({ name: ModalList.OrderConfirmation, payload });
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
      })
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
