<template>
  <div class="default-layout">
    <MLoader />
    <div id="viewport">
      <OHeader />
      <OMicrocart />
      <slot />
      <LazyHydrate when-visible>
        <OFooter />
      </LazyHydrate>
      <LazyHydrate when-idle>
        <OModal />
      </LazyHydrate>
      <LazyHydrate when-idle>
        <ONotification />
      </LazyHydrate>
      <LazyHydrate when-idle>
        <MCookieNotification />
      </LazyHydrate>
      <LazyHydrate when-idle>
        <MOfflineBadge />
      </LazyHydrate>
      <LazyHydrate when-visible>
        <OBottomNavigation />
      </LazyHydrate>
    </div>
    <vue-progress-bar />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import OHeader from 'theme/components/organisms/o-header';
import OMicrocart from 'theme/components/organisms/o-microcart';
import OFooter from 'theme/components/organisms/o-footer';
import MLoader from 'theme/components/molecules/m-loader';
import { isServer } from '@vue-storefront/core/helpers';
import Head from 'theme/head';
import config from 'config';
import { ModalList } from 'theme/store/ui/modals'
import LazyHydrate from 'vue-lazy-hydration'

export default {
  components: {
    OHeader,
    OMicrocart,
    OFooter,
    MLoader,
    ONotification: () => import('theme/components/organisms/o-notification'),
    MCookieNotification: () => import('theme/components/molecules/m-cookie-notification'),
    MOfflineBadge: () => import('theme/components/molecules/m-offline-badge'),
    OBottomNavigation: () => import('theme/components/molecules/m-offline-badge'),
    OModal: () => import('theme/components/organisms/o-modal'),
    LazyHydrate
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
