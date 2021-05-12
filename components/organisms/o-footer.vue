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
          <SfListItem>
            <router-link to="/legal" exact>
              <SfMenuItem
                class="sf-footer__menu-item"
                :label="$t('Terms of Service')"
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
          <SfListItem v-if="multistoreEnabled">
            <SfMenuItem
              @click.native="showLanguageSwitcher"
              class="sf-footer__menu-item"
              :label="currentLanguage"
            />
          </SfListItem>
        </SfList>
      </SfFooterColumn>
      <SfFooterColumn :title="$t('Social')" class="social-column">
        <div class="social-icon">
          <a
            :href="item.url"
            v-for="item in social"
            :key="item"
            class="social-icon__link"
            :class="'-' + item.name"
            target="_blank"
          />
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

export default {
  name: 'OFooter',
  components: {
    ABackToTop,
    SfFooter,
    SfList,
    SfMenuItem
  },
  data () {
    return {
      social: [
        {
          name: 'facebook',
          url: 'https://www.facebook.com/petsies/'
        },
        {
          name: 'instagram',
          url: 'https://www.instagram.com/petsies/'
        },
        {
          name: 'twitter',
          url: 'https://twitter.com/petsiesofficial/'
        },
        {
          name: 'pinterest',
          url: 'https://www.pinterest.com/petsies/'
        }
      ]
    };
  },
  computed: {
    ...mapGetters('user', ['isLoggedIn']),
    multistoreEnabled () {
      return get(config, 'storeViews.multistore', false);
    },
    currentLanguage () {
      const { i18n = config.i18n } = currentStoreView();
      return `${i18n.defaultCountry} / ${i18n.defaultLanguage} / ${i18n.currencyCode}`;
    },
    links () {
      return {
        orders: {
          name: 'Orders',
          children: [
            {
              name: 'My account',
              ...this.isLoggedIn
                ? { link: '/my-account' }
                : { clickHandler: () => this.openModal({ name: ModalList.Auth, payload: 'login' }) }
            },
            { name: 'Delivery', link: '/delivery' },
            { name: 'Return policy', link: '/returns' }
          ]
        },
        help: {
          name: 'Help',
          children: [
            { name: 'Customer service', link: '/customer-service' },
            { name: 'Size guide', link: '/size-guide' },
            { name: 'Contact us', link: '/contact' },
            { name: 'Typography', link: '/typography-text' }
          ]
        },
        about: {
          name: 'About us',
          children: [
            {
              name: 'About us',
              link: getPathForStaticPage('/about-us')
            },
            {
              name: 'Customer service',
              link: getPathForStaticPage('/customer-service')
            },
            { name: 'Store locator', link: '/store-locator' }
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
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@storefront-ui/shared/styles/helpers/breakpoints";

.o-footer {
  background-color: var(--c-footer);
  padding-bottom: var(--spacer-lg);
  .sf-menu-item {
    --menu-item-font-size: var(--font-sm);
    --menu-item-label-color: var(--c-light-variant);
    &:hover {
      --menu-item-label-color: var(--c-light-variant);
    }
  }
  .sf-footer {
    --footer-width: 1272px;
    --footer-padding: 0 var(--spacer-sm);
    --footer-column-title-color: var(--c-light-variant);
    --footer-column-title-background: var(--c-footer);
  }
  .sf-list {
    &__item {
      --list-item-margin: var(--spacer-2xs) 0;
    }
  }
  .social-column {
    flex-basis: auto;
  }
  .social-icon {
    display: flex;
    justify-content: space-between;
    padding: var(--spacer-sm) var(--spacer-xl);
    &__link {
      background-image: url(../../assets/footer-socials.png);
      display: block;
      height: 42px;
      width: 42px;
      &.-facebook {
        background-position: -1px -1px;
      }
      &.-instagram {
        background-position: -45px -1px;
      }
      &.-twitter {
        background-position: -89px -1px;
      }
      &.-pinterest {
        background-position: -133px -1px;
      }
    }
  }
  @include for-desktop {
    max-width: 100%;
  }
}
</style>
