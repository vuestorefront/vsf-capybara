<template>
  <div id="static">
   <!-- <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    >
      <template #link="{breadcrumb}">
        <router-link :to="localizedRoute(breadcrumb.route.link)" class="sf-breadcrumbs__breadcrumb">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs> -->
    <SfContentPages
      :active="currentRoute.title"
      :title="currentRoute.title"
      @click:change="updateRoute"
    >
      <SfContentPage v-for="n in navigation" :key="n.title" :title="n.title">
        <AStatic :content="content" />
      </SfContentPage>
    </SfContentPages>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import i18n from '@vue-storefront/i18n';
import {
  SfBreadcrumbs,
  SfContentPages
} from '@storefront-ui/vue';
import { getPathForStaticPage } from 'theme/helpers';
import CmsPage from '@vue-storefront/core/pages/CmsPage';
import AStatic from 'theme/components/atoms/a-static';

export default {
  name: 'Static',
  components: {
    SfBreadcrumbs,
    SfContentPages,
    AStatic
  },
  mixins: [CmsPage],
  data () {
    return {
      navigation: [
        { title: i18n.t('Who We Are?'), link: '/pages/about-us', isCms: true },
        { title: i18n.t('Our Products'), link: '/pages/our-products.html', isCms: true },
        { title: i18n.t('Our Expertise'), link: '/pages/pages/our-expertise', isCms: true },
        { title: i18n.t('Our Brands & Partners'), link: '/pages/capitools-brands-and-partners', isCms: true },
        { title: i18n.t('Our Guarantee'), link: '/pages/our-guarantee', isCms: true },
        { title: i18n.t('Promotions'), link: '/pages/deals-promos', isCms: true },
        { title: i18n.t('New Products'), link: '/pages/new-products', isCms: true },
        { title: i18n.t('Contact Us'), link: '/pages/contact-capitools', isCms: true },
        { title: i18n.t('Sitemap'), link: '/pages/sitemap', isCms: true },
        { title: i18n.t('We are hiring'), link: '/pages/we-are-hiring', isCms: true },
        { title: i18n.t('Secure Payment'), link: '/pages/secure-payment', isCms: true },
        { title: i18n.t('Terms of Sales'), link: '/pages/terms-of-sales', isCms: true },
        { title: i18n.t('Legal Information'), link: '/pages/legal-information', isCms: true },
        { title: i18n.t('Payment methods'), link: '/pages/payment-info', isCms: true },
        { title: i18n.t('Satisfied or refunded'), link: '/pages/satisfied-or-refunded', isCms: true },
        { title: i18n.t('Partners'), link: '/pages/partners', isCms: true },
        { title: i18n.t('Cyber Security'), link: '/pages/cyber-security', isCms: true },
        { title: i18n.t('Cookie notice information'), link: '/pages/cookie-notice-information', isCms: true },
        { title: i18n.t('My orders'), link: '/pages/my-capitools-order', isCms: true },
        { title: i18n.t('My assets'), link: '/pages/my-assets', isCms: true },
        { title: i18n.t('My Address'), link: '/pages/my-address', isCms: true },
        { title: i18n.t('My Personal details'), link: '/pages/my-personal-details', isCms: true },
        { title: i18n.t('My coupons'), link: '/pages/my-coupons', isCms: true },
        { title: i18n.t('FAQ (Frequently Asked Questions)'), link: '/pages/f-a-q-frequently-asked-questions', isCms: true },
        { title: i18n.t('After-sales service & customer relations'), link: '/pages/after-sales-service-and-customer-relations', isCms: true },
        { title: i18n.t('Payment in 3 installments'), link: '/pages/payment-in-three-installments', isCms: true }, 
        { title: i18n.t('Delivery'), link: '/pages/delivery', isCms: true },
        { title: i18n.t('Return Policy'), link: '/pages/return-policy', isCms: true },
        { title: i18n.t('Swap Europe Network Warranty'), link: '/pages/swap-europe-network-warranty', isCms: true },
      ]
    };
  },
  computed: {
    ...mapGetters({
      defaultContent: 'defaultContent/getDefaultContent'
    }),
    breadcrumbs () {
      return [
        { text: i18n.t('Homepage'), route: { link: this.localizedRoute('/') } },
        { text: this.currentRoute.title }
      ];
    },
    currentRoute () {
      return {
        ...this.navigation.find(navigation => this.localizedRoute(navigation.link) === this.$route.path)
      };
    },
    content () {
      return this.currentRoute.isCms
        ? {
          title: this.$store.state.cmsPage.current.title,
          message: this.$store.state.cmsPage.current.content
        }
        : this.defaultContent;
    }
  },
  methods: {
    updateRoute (title) {
      /**
       * On mobile view clicking the "back" icon in SfContentPages emits click:change
       * event but without an argument. Unfortunately the same event is also used for
       * "normal" page changes so it has to be checked explicitly if it comes from "back"
       * icon or not. Currently this is the only way to do that.
       */
      if (title === undefined) {
        // "Back" icon was clicked in SfContentPages
        this.$router.back();
      } else {
        // "Normal" navigation to next page - if it exists
        const nextRoute = this.navigation.find(navigation => navigation.title === title);
        if (nextRoute) {
          this.$router.push(nextRoute.link);
        }
      }
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('defaultContent/updateDefaultContent')
    ])
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

#static {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    padding: 0 var(--spacer-sm);
    margin: 0 auto;
  }
  --content-pages-height: auto;
  ::v-deep {
    .sf-content-pages__content
    {
      height: min-content;
    }
    .sf-content-pages__sidebar 
    {
      display: none;
    }
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
::v-deep {
  .sf-bar__icon *[role=button] {
    cursor: pointer;
  }
}
</style>
