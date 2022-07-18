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
        :title="linkGroup.name"
      >
        <SfList>
          <SfListItem v-for="link in linkGroup.children" :key="link.name">
            <router-link v-if="link.link" :to="localizedRoute(link.link)" :target="link.target" exact>
              <SfMenuItem class="sf-footer__menu-item" :label="link.name" />
            </router-link>
            <SfMenuItem
              v-else-if="link.clickHandler"
              class="sf-footer__menu-item"
              :label="link.name"
              @click="link.clickHandler"
            />
          </SfListItem>
        </SfList>
      </SfFooterColumn>
      <SfFooterColumn title="Get more @Petsies cuteness" class="social-column">
        <MNewsletterSubscription />
        <div class="social-icon">
          <a
            :href="item.url"
            v-for="item in social"
            :key="item.name + ';' + item.url"
            class="social-icon__link"
            :class="'-' + item.name"
            target="_blank"
          />
        </div>
      </SfFooterColumn>

      <div class="_additional-information">
        <router-link to="//support.mypetsies.com/support/home" target="_blank" exact>
          <SfMenuItem
            class="sf-footer__menu-item"
            :label="$t('Contact Us')"
          />
        </router-link>

        <div class="_legal-information">
          ©{{ new Date().getFullYear() }} Budsies Co LLC. All Rights Reserved.
          |
          <router-link to="/terms-of-service" exact>
            {{ $t('Terms of Service') }}
          </router-link>
          |
          <router-link to="/privacy-policy" exact>
            {{ $t('Privacy Policy') }}
          </router-link>
        </div>
      </div>
    </SfFooter>

    <ABackToTop bottom="20px" right="20px" visibleoffset="200" class="desktop-only" />
  </footer>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import ABackToTop from 'theme/components/atoms/a-back-to-top';
import MNewsletterSubscription from 'theme/components/molecules/m-newsletter-subscription.vue';
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
    MNewsletterSubscription,
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
        about: {
          name: 'Company',
          children: [
            {
              name: this.$t('About'),
              link: '/about-petsies/'
            },
            {
              name: this.$t('Blog'),
              link: '/blog/',
              target: '_blank'
            },
            {
              name: this.$t('Refund & Return Policy'),
              link: '/craftsmanship-promise/'
            },
            {
              name: this.$t('Media'),
              link: '//support.mypetsies.com/support/solutions/folders/13000003990',
              target: '_blank'
            },
            {
              name: this.$t('How it Works'),
              link: '/how-it-works/'
            }
          ]
        },
        services: {
          name: this.$t('Services'),
          children: [
            { name: this.$t('Custom Forevers'), link: '/forevers-pet-plush/' },
            { name: this.$t('Custom Pillows'), link: '/custom-pillows/' },
            { name: this.$t('Custom Socks'), link: { name: 'printed-socks-creation-page' } },
            { name: this.$t('Custom Face Masks'), link: { name: 'printed-masks-creation-page' } },
            { name: this.$t('Custom Pet Keychains'), link: { name: 'printed-keychains-creation-page' } },
            { name: this.$t('Custom Felted Magnets'), link: { name: 'felted-magnets-creation-page' } },
            { name: this.$t('Custom Bulk'), link: '/bulk-custom-stuffed-animal-manufacture/' },
            { name: this.$t('Gift Cards'), link: { name: 'gift-cards' } },
            { name: this.$t('Gift Box'), link: { name: 'giftbox' } },
            { name: this.$t('Accessories'),
              link: {
                name: 'category',
                params: {
                  slug: 'petsies-accessories-11'
                }
              }
            }
          ]
        },
        account: {
          name: this.$t('Account'),
          children: [
            {
              name: this.$t('My account'),
              ...this.isLoggedIn
                ? { link: { name: 'my-account' } }
                : { clickHandler: () => this.openModal({ name: ModalList.Auth, payload: 'login' }) }
            },
            { name: this.$t('My Cart'), link: { name: 'detailed-cart' } },
            { name: this.$t('Rising Starts'), link: '/rising-stars/' }
          ]
        },
        quickLInks: {
          name: this.$t('Quick Links'),
          children: [
            { name: this.$t('Veterinarians'), link: '/partners/' },
            { name: this.$t('Become a Partner'), link: '/partners/' },
            { name: this.$t('Resellers'), link: '/partners/' },
            { name: this.$t('Affiliates'), link: '/affiliate-home/' },
            { name: this.$t('Corporate Buying'), link: '/partners/' },
            { name: this.$t('FAQ'), link: '//support.mypetsies.com/support/home', target: '_blank' },
            { name: this.$t('Referral Rewards'), link: '//referrals.mypetsies.com/', target: '_blank' }
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
  .m-newsletter-subscription {
    margin-top: var(--spacer-xs);
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

    --footer-column-title-font-size: --h4-font-size;
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

  ._additional-information {
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-top: var(--spacer-xl);
    padding: 0 var(--spacer-xl);
    text-align: center;
    width: 100%;
  }

  ._legal-information {
    color: var(--c-light-variant);
    font-size: var(--font-xs);
    margin-top: var(--spacer-xs);

    a {
      color: inherit;
    }
  }

  @include for-desktop {
    max-width: 100%;
    ::v-deep .sf-footer-column__content {
      padding: 0;
    }

    ._additional-information {
      padding: 0;
    }
  }
}
</style>
