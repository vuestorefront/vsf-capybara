<template>
  <div id="static">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    >
      <template #link="{breadcrumb}">
        <router-link :to="localizedRoute(breadcrumb.route.link)" class="sf-breadcrumbs__link">
          {{ breadcrumb.text }}
        </router-link>
      </template>
    </SfBreadcrumbs>
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
        { title: i18n.t('About us (Magento CMS)'), link: getPathForStaticPage('/about-us'), isCms: true },
        { title: i18n.t('Customer service (Magento CMS)'), link: getPathForStaticPage('/customer-service'), isCms: true },
        { title: i18n.t('Customer service'), link: '/customer-service' },
        { title: i18n.t('Legal notice'), link: '/legal' },
        { title: i18n.t('Store locator'), link: '/store-locator' },
        { title: i18n.t('Delivery'), link: '/delivery' },
        { title: i18n.t('Return policy'), link: '/returns' },
        { title: i18n.t('Privacy policy'), link: '/privacy' },
        { title: i18n.t('Size guide'), link: '/size-guide' },
        { title: i18n.t('Contact us'), link: '/contact' }
      ],
      messages: [
        {
          title: 'Privacy Policy',
          message: `To help us achieve our goal of providing the highest quality products and
      services, we use information from our interactions with you and other
      customers, as well as from other parties. Because we respect your privacy,
      we have implemented procedures to ensure that your personal information is
      handled in a safe, secure, and responsible manner. We have posted this
      privacy policy in order to explain our information collection practices
      and the choices you have about the way information is collected and used.`
        },
        {
          title: 'Security',
          message: `Personal information provided on the website and online credit card
      transactions are transmitted through a secure server. We are committed to
      handling your personal information with high standards of information
      security. We take appropriate physical, electronic, and administrative
      steps to maintain the security and accuracy of personally identifiable
      information we collect, including limiting the number of people who have
      physical access to our database servers, as well as employing electronic
      security systems and password protections that guard against unauthorized
      access.`
        },
        {
          title: 'Additional Information',
          message: `This website ("website") is operated by Luma Inc., which includes Luma
      stores, and Luma Private Sales. This privacy policy only covers
      information collected at this website, and does not cover any information
      collected offline by Luma. All Luma websites are covered by this privacy
      policy.`
        }
      ]
    };
  },
  computed: {
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
        : this.messages;
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
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";

#static {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  @include for-desktop {
    max-width: 1240px;
    margin: auto;
  }
}
.breadcrumbs {
  padding: var(--spacer-big) var(--spacer-extra-big) var(--spacer-extra-big);
}
::v-deep {
  .sf-bar__icon *[role=button] {
    cursor: pointer;
  }
}
</style>
