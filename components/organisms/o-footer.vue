<template>
  <footer class="o-footer">
    <SfFooter class="footer-links" :column="5" :multiple="true">
      <SfFooterColumn
        v-for="linkGroup in links"
        :key="linkGroup.name"
        :title="$t(linkGroup.name)"
      >
        <SfList>
          <SfListItem v-for="link in linkGroup.children" :key="link.name">
            <router-link :to="localizedRoute(link.link)" exact>
              <SfMenuItem class="sf-footer__menu-item" :label="$t(link.name)" />
            </router-link>
          </SfListItem>
        </SfList>
      </SfFooterColumn>
      <SfFooterColumn :title="$t('Others')">
        <SfList>
          <SfListItem>
            <router-link to="/legal" exact>
              <SfMenuItem
                class="sf-footer__menu-item"
                :label="$t('Legal notice')"
              />
            </router-link>
          </SfListItem>
          <SfListItem>
            <router-link to="/privacy" exact>
              <SfMenuItem
                class="sf-footer__menu-item"
                :label="$t('Privacy policy')"
              />
            </router-link>
          </SfListItem>
          <SfListItem>
            <LanguageSwitcher class="sf-footer__menu-item" />
          </SfListItem>
          <SfListItem class="sf-footer__menu-item">
            {{ getVersionInfo }}
          </SfListItem>
        </SfList>
      </SfFooterColumn>
      <SfFooterColumn :title="$t('Social')" class="social-column">
        <div class="social-icon">
          <img
            v-for="item in social"
            :key="item"
            :src="'assets/icons/' + item + '.svg'"
            class="social-icon__img"
          />
        </div>
      </SfFooterColumn>
    </SfFooter>
    <back-to-top bottom="20px" right="20px" visibleoffset="200" />
  </footer>
</template>

<script>
import LanguageSwitcher from "theme/components/core/LanguageSwitcher";
import BackToTop from "theme/components/atoms/a-back-to-top";
import { SfFooter, SfList, SfMenuItem } from "@storefront-ui/vue";
import { getPathForStaticPage } from "theme/helpers";
import config from "config";
import get from "lodash-es/get";

export default {
  name: "MainFooter",
  components: {
    LanguageSwitcher,
    BackToTop,
    SfFooter,
    SfList,
    SfMenuItem
  },
  data() {
    return {
      links: {
        orders: {
          name: "Orders",
          children: [
            { name: "My account", link: "/my-account" },
            { name: "Delivery", link: "/delivery" },
            { name: "Return policy", link: "/returns" }
          ]
        },
        help: {
          name: "Help",
          children: [
            { name: "Customer service", link: "/customer-service" },
            { name: "Size guide", link: "/size-guide" },
            { name: "Contact us", link: "/contact" }
          ]
        },
        about: {
          name: "About us",
          children: [
            {
              name: "About us (Magento CMS)",
              link: getPathForStaticPage("/about-us")
            },
            {
              name: "Customer service (Magento CMS)",
              link: getPathForStaticPage("/customer-service")
            },
            { name: "Store locator", link: "/store-locator" }
          ]
        }
      },
      social: ["facebook", "pinterest", "twitter", "youtube"]
    };
  },
  computed: {
    multistoreEnabled() {
      return get(config, "storeViews.multistore", false);
    },
    getVersionInfo() {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/vue/styles";
@mixin for-desktop {
  @media screen and (min-width: $desktop-min) {
    @content;
  }
}
.footer-links {
  max-width: 64rem;
  margin-left: auto;
  margin-right: auto;
}
.social-column {
  margin-left: auto;
}
.social-icon {
  padding: 20px 40px;
  @include for-desktop {
    padding: 6px 0;
  }
  &__img {
    height: 0.75rem;
    margin-right: 1.25rem;
  }
}
</style>
