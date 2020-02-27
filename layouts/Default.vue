<template>
  <div class="default-layout">
    <loader />
    <div id="viewport" class="w-100 relative">
      <OHeader />
      <AsyncSidebar
        :async-component="SearchPanel"
        :is-open="isSearchPanelOpen"
        @close="$store.commit('ui/setSearchpanel')"
      />
      <div id="cart" data-testid="microcart">
        <SfSidebar
          :visible="isMicrocartOpen"
          :heading-title="$t('My Cart')"
          class="sf-sidebar--right"
          @close="$store.commit('ui/setMicrocart')"
        >
          <OMicrocart />
        </SfSidebar>
      </div>
      <slot />
      <OFooter />
      <OModal />
      <ONotification />
      <CookieNotification />
      <OfflineBadge />
      <OrderConfirmation
        v-if="loadOrderConfirmation"
        :orders-data="ordersData"
      />
      <OBottomNavigation />
    </div>
    <vue-progress-bar />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import AsyncSidebar from 'theme/components/theme/blocks/AsyncSidebar/AsyncSidebar';
import OHeader from 'theme/components/organisms/o-header';
import OFooter from 'theme/components/organisms/o-footer';
import OModal from 'theme/components/organisms/o-modal';
import OBottomNavigation from 'theme/components/organisms/o-bottom-navigation';
import Loader from 'theme/components/core/Loader';
import ONotification from 'theme/components/organisms/o-notification';
import CookieNotification from 'theme/components/core/CookieNotification';
import OfflineBadge from 'theme/components/core/OfflineBadge';
import OMicrocart from 'theme/components/organisms/o-microcart';
import { isServer } from '@vue-storefront/core/helpers';
import Head from 'theme/head';
import config from 'config';
import { SfSidebar } from '@storefront-ui/vue';

const SearchPanel = () =>
  import(
    /* webpackChunkName: "vsf-search-panel" */ 'theme/components/core/blocks/SearchPanel/SearchPanel'
  );
const OrderConfirmation = () =>
  import(
    /* webpackChunkName: "vsf-modals" */ 'theme/components/core/blocks/Checkout/OrderConfirmation'
  );

export default {
  components: {
    OHeader,
    OFooter,
    Loader,
    ONotification,
    CookieNotification,
    OfflineBadge,
    OMicrocart,
    OrderConfirmation,
    OBottomNavigation,
    AsyncSidebar,
    SfSidebar,
    OModal
  },
  data () {
    return {
      loadOrderConfirmation: false,
      ordersData: [],
      OMicrocart,
      SearchPanel
    };
  },
  computed: {
    ...mapState({
      isSearchPanelOpen: state => state.ui.searchpanel,
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
      this.$Progress.finish();
    });
    this.$bus.$on('offline-order-confirmation', this.onOrderConfirmation);
  },
  mounted () {
    this.$store.dispatch('ui/checkWebpSupport');
  },
  beforeDestroy () {
    this.$bus.$off('offline-order-confirmation', this.onOrderConfirmation);
  },
  methods: {
    onOrderConfirmation (payload) {
      this.loadOrderConfirmation = true;
      this.ordersData = payload;
      this.$bus.$emit('modal-show', 'modal-order-confirmation');
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
    }
  },
  serverPrefetch () {
    return this.fetchMenuData();
  },
  metaInfo: Head
};
</script>

<style lang="scss" src="theme/css/main.scss"></style>
