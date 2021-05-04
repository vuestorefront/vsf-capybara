<template>
  <div id="my-account">
    <SfBreadcrumbs class="breadcrumbs desktop-only" :breadcrumbs="breadcrumbs">
      <template #link="{breadcrumb}">
        <router-link :to="breadcrumb.route.link" class="sf-breadcrumbs__breadcrumb">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
    <SfContentPages
      :title="$t('My Account')"
      :active="activePage"
      class="my-account"
      @click:change="changeActivePage"
    >
      <SfContentCategory :title="$t('Personal Details')">
        <SfContentPage :title="$t('My profile')">
          <OMyAccountProfile />
        </SfContentPage>
        <SfContentPage :title="$t('Shipping details')">
          <OMyAccountShippingDetails />
        </SfContentPage>
        <SfContentPage :title="$t('Loyalty Card')">
          <OMyAccountPlaceholder :title="$t('Loyalty Card')" />
        </SfContentPage>
        <SfContentPage :title="$t('My newsletter')">
          <OMyAccountPlaceholder :title="$t('My newsletter')" />
        </SfContentPage>
      </SfContentCategory>
      <SfContentPage :title="$t('Log out')" />
      <SfContentCategory :title="$t('Order details')">
        <SfContentPage :title="$t('Order history')">
          <OMyAccountOrdersHistory />
        </SfContentPage>
        <SfContentPage :title="$t('My reviews')">
          <OMyAccountPlaceholder :title="$t('My reviews')" />
        </SfContentPage>
      </SfContentCategory>
    </SfContentPages>
  </div>
</template>

<script>
import MyAccount from '@vue-storefront/core/pages/MyAccount';

import OMyAccountProfile from 'theme/components/organisms/o-my-account-profile';
import OMyAccountShippingDetails from 'theme/components/organisms/o-my-account-shipping-details'
import OMyAccountOrdersHistory from 'theme/components/organisms/o-my-account-orders-history';
import OMyAccountPlaceholder from 'theme/components/organisms/o-my-account-placeholder';
import { localizedRoute } from '@vue-storefront/core/lib/multistore';
import { SfBreadcrumbs, SfContentPages } from '@storefront-ui/vue';

export default {
  components: {
    SfBreadcrumbs,
    SfContentPages,
    OMyAccountProfile,
    OMyAccountShippingDetails,
    OMyAccountOrdersHistory,
    OMyAccountPlaceholder
  },
  mixins: [MyAccount],
  data () {
    return {
      activePage: this.$t('My profile'),
      breadcrumbs: [
        {
          text: this.$t('Home'),
          route: {
            link: localizedRoute('/')
          }
        },
        {
          text: this.$t('My account'),
          route: {
            link: localizedRoute('/my-account')
          }
        }
      ]
    };
  },
  methods: {
    changeActivePage (title) {
      if (title === 'Log out') {
        this.logout();
        return;
      }
      this.activePage = title;
    },
    async logout () {
      await this.$store.dispatch('user/logout', {});
      this.$router.push(this.localizedRoute('/'));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#my-account {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    padding: 0 var(--spacer-sm);
    margin: 0 auto;
  }
}
.my-account {
  --content-pages-height: auto;
  ::v-deep {
    .sf-content-pages__content,
    .sf-content-pages__sidebar {
      height: min-content;
    }
  }
  @include for-mobile {
    --content-pages-sidebar-category-title-font-weight: var(--font-normal);
    --content-pages-sidebar-category-title-margin: var(--spacer-sm) var(--spacer-sm) var(--spacer-sm) var(--spacer-base);
  }
  @include for-desktop {
    --content-pages-sidebar-category-title-margin: var(--spacer-xl) 0 0 0;
  }
}
.breadcrumbs {
  padding: var(--spacer-base) 0;
}
</style>
