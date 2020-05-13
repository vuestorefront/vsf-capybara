<template>
  <div id="static">
    <SfBreadcrumbs
      class="breadcrumbs desktop-only"
      :breadcrumbs="breadcrumbs"
    >
      <template #link="{breadcrumb}">
        <router-link :to="localizedRoute(breadcrumb.route.link)" class="sf-breadcrumbs__breadcrumb">
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
    .sf-content-pages__content,
    .sf-content-pages__sidebar {
      height: min-content;
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
