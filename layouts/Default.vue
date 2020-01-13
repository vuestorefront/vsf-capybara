<template>
  <div class="default-layout">
    <loader />
    <div id="viewport" class="w-100 relative">
      <main-header />
      <async-sidebar
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
          <Microcart />
        </SfSidebar>
      </div>
      <async-sidebar
        :async-component="SidebarMenu"
        :is-open="isSidebarOpen"
        direction="left"
        @close="$store.commit('ui/setSidebar')"
      />
      <async-sidebar
        :async-component="Wishlist"
        :is-open="isWishlistOpen"
        @close="$store.commit('ui/setWishlist')"
      />
      <slot />
      <main-footer />
      <notification />
      <sign-up />
      <cookie-notification />
      <offline-badge />
      <order-confirmation
        v-if="loadOrderConfirmation"
        :orders-data="ordersData"
      />
    </div>
    <vue-progress-bar />
  </div>
</template>

<script>
import { mapState } from "vuex";
import AsyncSidebar from "theme/components/theme/blocks/AsyncSidebar/AsyncSidebar";
import MainHeader from "theme/components/organisms/o-header";
import MainFooter from "theme/components/organisms/o-footer";
import Loader from "theme/components/core/Loader";
import Notification from "theme/components/core/Notification";
import SignUp from "theme/components/core/blocks/Auth/SignUp";
import CookieNotification from "theme/components/core/CookieNotification";
import OfflineBadge from "theme/components/core/OfflineBadge";
import Microcart from "theme/components/organisms/o-microcart";
import { isServer } from "@vue-storefront/core/helpers";
import Head from "theme/head";
import config from "config";
import { SfSidebar } from "@storefront-ui/vue";

const SidebarMenu = () =>
  import(
    /* webpackPreload: true */ /* webpackChunkName: "vsf-sidebar-menu" */ "theme/components/core/blocks/SidebarMenu/SidebarMenu"
  );
const Wishlist = () =>
  import(
    /* webpackPreload: true */ /* webpackChunkName: "vsf-wishlist" */ "theme/components/core/blocks/Wishlist/Wishlist"
  );
const SearchPanel = () =>
  import(
    /* webpackChunkName: "vsf-search-panel" */ "theme/components/core/blocks/SearchPanel/SearchPanel"
  );
const OrderConfirmation = () =>
  import(
    /* webpackChunkName: "vsf-order-confirmation" */ "theme/components/core/blocks/Checkout/OrderConfirmation"
  );

export default {
  components: {
    MainHeader,
    MainFooter,
    SidebarMenu, // eslint-disable-line vue/no-unused-components
    Loader,
    Notification,
    SignUp,
    CookieNotification,
    OfflineBadge,
    Microcart,
    OrderConfirmation,
    AsyncSidebar,
    SfSidebar
  },
  data() {
    return {
      loadOrderConfirmation: false,
      ordersData: [],
      Microcart,
      Wishlist,
      SearchPanel,
      SidebarMenu
    };
  },
  computed: {
    ...mapState({
      isSearchPanelOpen: state => state.ui.searchpanel,
      isSidebarOpen: state => state.ui.sidebar,
      isMicrocartOpen: state => state.ui.microcart,
      isWishlistOpen: state => state.ui.wishlist
    })
  },
  beforeMount() {
    // Progress bar on top of the page
    this.$router.beforeEach((to, from, next) => {
      this.$Progress.start();
      this.$Progress.increase(40);
      next();
    });
    this.$router.afterEach(() => {
      this.$Progress.finish();
    });
    this.$bus.$on("offline-order-confirmation", this.onOrderConfirmation);
  },
  beforeDestroy() {
    this.$bus.$off("offline-order-confirmation", this.onOrderConfirmation);
  },
  methods: {
    onOrderConfirmation(payload) {
      this.loadOrderConfirmation = true;
      this.ordersData = payload;
      this.$bus.$emit("modal-show", "modal-order-confirmation");
    },
    fetchMenuData() {
      return this.$store.dispatch("category/list", {
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
  serverPrefetch() {
    return this.fetchMenuData();
  },
  metaInfo: Head
};
</script>

<style lang="scss" src="theme/css/main.scss"></style>
