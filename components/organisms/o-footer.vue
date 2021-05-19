<template>
  <footer class="o-footer">
    <div class="o-footer__logo" />
    <div class="o-footer__slogan">
      Handmade pet keepsakes
    </div>
    <SfFooter :column="6" :multiple="true">
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
      <SfFooterColumn title="Get more @Petsies cuteness" class="social-column">
        <form class="o-footer__subscribe">
          <SfInput v-model="subscribeEmail" name="subscribeEmail" label="Email address" :required="true" />
          <SfButton class="color-primary">
            Join
          </SfButton>
        </form>
        <div class="social-icon">
          <a
            :href="item.url"
            v-for="item in social"
            :key="item.name"
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
import { SfFooter, SfList, SfMenuItem, SfInput, SfButton } from '@storefront-ui/vue';
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
    SfMenuItem,
    SfInput,
    SfButton
  },
  props: {
    subscribeEmail: {
      type: String,
      default: ''
    }
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
  margin-top: calc(var(--spacer-2xl) + var(--spacer-xl));
  &__logo {
    background-image: url(../../assets/logo-footer.png);
    height: 121px;
    margin: -60px auto 0;
    width: 127px;
  }
  &__slogan {
    text-align: center;
    color: var(--c-light-variant);
    font-family: var(--font-family-intro);
    font-size: var(--font-2xl);
    margin: var(--spacer-base) 0;
  }
  &__subscribe {
    --input-background: var(--c-light-variant);
    display: flex;
    align-items: flex-start;
    ::v-deep .sf-input {
      &__wrapper {
        margin-top: 3px;
      }
      &__label {
        --input-label-font-size: var(--font-sm);
      }
      input {
        --input-border: none;
        --input-font-size: var(--font-sm);
        &:focus {
          & ~ * {
            --input-label-font-size: var(--font-2xs);
          }
        }
      }
      &--has-text,
      &--filled {
        .sf-input__label {
          --input-label-font-size: var(--font-2xs);
        }
      }
    }
    .sf-button {
      margin-left: var(--spacer-base);
      --button-font-size: var(--font-xs);
    }
  }
  ::v-deep .sf-menu-item {
    --menu-item-font-size: var(--font-sm);
    --menu-item-label-color: var(--c-light-variant);
    &:hover {
      --menu-item-label-color: var(--c-light-variant);
    }
    .sf-icon {
      --icon-color: var(--c-light-variant);
    }
  }
  .sf-footer {
    --footer-width: 1272px;
    --footer-padding: 0 var(--spacer-sm);
    --footer-column-title-color: var(--c-light-variant);
    --footer-column-title-background: var(--c-footer);
  }
  ::v-deep .sf-footer-column__content {
    padding: 0 var(--spacer-xl);
  }
  .sf-list {
    &__item {
      --list-item-margin: var(--spacer-2xs) 0;
    }
  }
  ::v-deep .sf-chevron {
    &__bar {
      &:after {
        --chevron-color: var(--c-light-variant);
      }
    }
  }
  .social-column {
    flex-basis: auto;
  }
  .social-icon {
    display: flex;
    justify-content: flex-start;
    padding: var(--spacer-sm) 0;
    &__link {
      background-image: url(../../assets/footer-socials.png);
      display: block;
      height: 42px;
      width: 42px;
      margin-right: var(--spacer-base);
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
    ::v-deep .sf-footer-column__content {
      padding: 0;
    }
  }
}
</style>
