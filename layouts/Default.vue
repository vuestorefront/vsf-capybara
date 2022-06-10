<template>
  <div
    class="default-layout"
    :class="{ 'storyblok-preview-mode': isStoryblokPreviewMode }"
  >
    <MLoader />
    <div id="viewport">
      <div class="_floating-elements">
        <PromotionPlatformBanner />
        <OTopNavigation />
        <OHeader class="_main-header" />
      </div>
      <OMicrocart />
      <div class="content">
        <slot />
      </div>
      <OFooter
        class="default-layout_footer"
        :class="{ '-show-for-medium-up': hideFooterOnMobile }"
      />
      <OModal />
      <ONotification />
      <MCookieNotification details-link="/privacy-policy" />
      <MOfflineBadge />
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
import OTopNavigation from 'theme/components/organisms/o-top-navigation';
import MLoader from 'theme/components/molecules/m-loader';
import ONotification from 'theme/components/organisms/o-notification';
import MCookieNotification from 'theme/components/molecules/m-cookie-notification';
import MOfflineBadge from 'theme/components/molecules/m-offline-badge';
import { isServer } from '@vue-storefront/core/helpers';
import Head from 'theme/head';
import config from 'config';
import { ModalList } from 'theme/store/ui/modals';

import PromotionPlatformBanner from 'src/modules/promotion-platform/components/Banner.vue';

export default {
  components: {
    PromotionPlatformBanner,
    OHeader,
    OMicrocart,
    OFooter,
    MLoader,
    ONotification,
    MCookieNotification,
    MOfflineBadge,
    OTopNavigation,
    OModal
  },
  data () {
    return {
      quicklink: null
    };
  },
  computed: {
    quicklinkEnabled () {
      return (
        typeof config.quicklink !== 'undefined' && config.quicklink.enabled
      );
    },
    isStoryblokPreviewMode () {
      return this.$route.query.hasOwnProperty('_storyblok');
    },
    hideFooterOnMobile () {
      return this.$route.name === 'phrase-pillow-customize';
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
    }
  },
  metaInfo: Head
};
</script>

<style lang="scss">
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.default-layout {
  $medium-breakpoint: 641px;

  &.storyblok-preview-mode {
    a,
    button {
      pointer-events: none;
    }
  }

  ._floating-elements {
    position: sticky;
    top: 0;
    z-index: 200;
    display: flex;
    flex-direction: column;
    max-height: 100vh;

    ._main-header {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
  }

  @media (max-width: $medium-breakpoint - 1px) {
    .-show-for-medium-up {
      display: none !important;
    }
  }

  @include for-desktop {
    ._floating-elements {
      ._main-header {
        overflow: visible;
      }
    }
  }
}
</style>
