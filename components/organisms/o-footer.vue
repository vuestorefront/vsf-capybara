<template>
  <footer class="o-footer">
    <SfFooter :column="5" :multiple="true">
      <SfFooterColumn
        v-for="linkGroup in links"
        :key="linkGroup.name"
        :title="$t(linkGroup.name)"
      >
        <SfList>
          <SfListItem v-for="link in linkGroup.children" :key="link.name">
            <router-link v-if="link.link" :to="localizedRoute(link.link)" exact>
              <SfMenuItem class="sf-footer__menu-item" :label="$t(link.name)" />
            </router-link>
            <SfMenuItem
              v-else-if="link.clickHandler"
              class="sf-footer__menu-item"
              :label="$t(link.name)"
              @click="link.clickHandler"
            />
          </SfListItem>
        </SfList>
      </SfFooterColumn>
      <SfFooterColumn :title="$t('Others')">
        <SfList>
          <!-- Not to use in V2 -->
          <!-- <SfListItem>
            <router-link to="/legal" exact>
              <SfMenuItem
                class="sf-footer__menu-item"
                :label="$t('Legal notice')"
              />
            </router-link>
          </SfListItem> -->
          <SfListItem>
            <router-link to="/legal" exact>
              <SfMenuItem
                class="sf-footer__menu-item"
                :label="$t('Privacy policy')"
              />
            </router-link>
          </SfListItem>
          <SfListItem v-if="multistoreEnabled">
            <SfMenuItem
              @click.native="showLanguageSwitcher"
              class="sf-footer__menu-item"
              :label="currentLanguage"
            />
          </SfListItem>
          <SfListItem class="sf-footer__menu-item">
            {{ getVersionInfo }}
          </SfListItem>
        </SfList>
      </SfFooterColumn>
      <SfFooterColumn :title="$t('Social')" class="social-column">
        <div v-for="item in social" :key="item.site" class="social-icon">
          <a :href="item.link">
            <img
              :key="item.site"
              :src="'/assets/icons/' + item.site + '.svg'"
              class="social-icon__img"
            >
          </a>
        </div>
      </SfFooterColumn>
    </SfFooter>
    <ABackToTop bottom="20px" right="20px" visibleoffset="200" class="desktop-only" />
  </footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ABackToTop from 'theme/components/atoms/a-back-to-top';
import { SfFooter, SfList, SfMenuItem } from '@storefront-ui/vue';
import { ModalList } from 'theme/store/ui/modals'
import { getPathForStaticPage } from 'theme/helpers';
import config from 'config';
import { currentStoreView } from '@vue-storefront/core/lib/multistore';
import get from 'lodash-es/get';
import { getSocialLinks } from 'theme/store/homepage'
import { Logger } from '@vue-storefront/core/lib/logger'

export default {
  name: 'OFooter',
  social: [],
  components: {
    ABackToTop,
    SfFooter,
    SfList,
    SfMenuItem
  },
  data () {
    return {
      social: this.getLinks()
    };
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    multistoreEnabled () {
      return get(config, 'storeViews.multistore', false);
    },
    getVersionInfo () {
      return `v${process.env.__APPVERSION__} ${process.env.__BUILDTIME__}`;
    },
    currentLanguage () {
      const { i18n = config.i18n } = currentStoreView();
      return `${i18n.defaultCountry} / ${i18n.defaultLanguage} / ${i18n.currencyCode}`;
    },
    links () {
      return {
        // Not to use in V2
        // orders: {
        // name: 'Orders',
        // children: [
        // {
        //   name: 'My account',
        //   ...this.isLoggedIn
        //     ? { link: '/my-account' }
        //     : { clickHandler: () => this.openModal({ name: ModalList.Auth, payload: 'login' }) }
        // },
        // { name: 'Delivery', link: '/delivery' }
        // { name: 'Return policy', link: '/returns' }
        // ]
        // },
        help: {
          name: 'Help',
          children: [
            // Not to use in V2
            // { name: 'Customer service', link: '/customer-service' },
            { name: 'Resources', link: '/legal' },
            { name: 'Contact us', link: getPathForStaticPage('/contact') }
          ]
        },
        about: {
          name: 'About us',
          children: [
            {
              name: 'About us',
              link: getPathForStaticPage('/about-us')
            },
            // Not to use in V2
            // {
            //   name: 'Customer service',
            //   link: getPathForStaticPage('/customer-service')
            // },
            { name: 'Store locator', link: getPathForStaticPage('/store-locator') }
          ]
        }
      };
    }
  },
  methods: {
    ...mapActions('ui', {
      openModal: 'openModal'
    }),
    showLanguageSwitcher () {
      this.openModal({ name: ModalList.LanguageSwitcher })
    },
    async getLinks () {
      try {
        this.social = await getSocialLinks()
        this.social = this.social.links
        return this.social
      } catch (err) {
        Logger.debug('Unable to load links' + err)()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-footer {
  @include for-desktop {
    max-width: 1272px;
    margin: auto;
  }
  .sf-footer {
    --footer-width: auto;
  }
}
.social-column {
  flex-basis: auto;
}
.social-icon {
  padding: var(--spacer-sm) var(--spacer-xl);
  @include for-desktop {
    padding: var(--spacer-xs) 0;
  }
  &__img {
    height: 1.75rem;
    &:not(:last-child) {
      margin-right: var(--spacer-base);
    }
  }
}
</style>
